Durante este proceso estuve trabajando en el diseño de un sistema tipo ChatGPT enfocado en biomedicina, particularmente en la consulta de información química de fármacos. La idea general no era solo consumir APIs, sino construir un flujo completo donde un usuario pudiera hacer una pregunta natural y recibir una respuesta fundamentada en datos reales. Este enfoque me obligó a pensar más como diseñador de sistemas que como alguien que solo escribe funciones aisladas. Al inicio, partía de una implementación muy limitada. Tenía una función que consultaba directamente un fármaco específico usando su identificador en ChEMBL. Por ejemplo:

```python
url = "https://www.ebi.ac.uk/chembl/api/data/molecule/CHEMBL25.json"
````

Esto funcionaba únicamente para la aspirina. En ese momento me di cuenta de que el sistema no era escalable ni útil en un contexto real, ya que cualquier usuario podría preguntar por distintos medicamentos. Este fue el primer punto de inflexión: entender que necesitaba desacoplar la lógica de identificación del fármaco de la obtención de sus propiedades.

A partir de ahí, investigué cómo funciona la API de ChEMBL y descubrí que existe un endpoint de búsqueda que permite encontrar moléculas a partir de texto. Esto me llevó a dividir el problema en dos pasos conceptuales: primero encontrar el identificador del fármaco, y después usar ese identificador para recuperar la información completa. El endpoint clave fue el siguiente:

```text
/molecule/search?q=drug_name
```

Con este descubrimiento, pasé de una lógica estática a una dinámica. Sin embargo, tener dos funciones separadas no era lo ideal desde el punto de vista de integración con un agente, así que decidí unificarlas en una sola función que resolviera todo el flujo. El resultado fue una función que primero realiza la búsqueda, selecciona el mejor candidato y luego hace una segunda petición para obtener los datos completos:

```python
def get_drug_info(drug_name: str):
    try:
        search_url = "https://www.ebi.ac.uk/chembl/api/data/molecule/search"
        params = {
            "q": drug_name,
            "format": "json"
        }
        
        search_response = requests.get(search_url, params=params)
        search_data = search_response.json()
        
        molecules = search_data.get("molecules", [])
        
        if not molecules:
            return {
                "status": "error",
                "content": f"No se encontró el fármaco: {drug_name}"
            }
        
        chembl_id = None
        for mol in molecules:
            if mol.get("pref_name", "").lower() == drug_name.lower():
                chembl_id = mol["molecule_chembl_id"]
                break
        
        if not chembl_id:
            chembl_id = molecules[0]["molecule_chembl_id"]
        
        molecule_url = f"https://www.ebi.ac.uk/chembl/api/data/molecule/{chembl_id}.json"
        molecule_response = requests.get(molecule_url)
        data = molecule_response.json()
        
        props = data.get("molecule_properties", {})
        
        info = f"""
Nombre: {data.get("pref_name")}
CHEMBL ID: {chembl_id}
Fórmula: {props.get("full_molformula")}
Peso molecular: {props.get("full_mwt")}
LogP (lipofilia): {props.get("alogp")}
Fase clínica máxima: {data.get("max_phase")}
Uso terapéutico: {data.get("therapeutic_flag")}
Tipo de molécula: {data.get("molecule_type")}
"""
        
        return {
            "status": "success",
            "content": info.strip()
        }
    
    except Exception as e:
        return {
            "status": "error",
            "content": f"Error al consultar la API: {str(e)}"
        }
```

Un aspecto importante que incorporé fue el manejo de errores. Decidí estandarizar la salida de la función usando una estructura tipo JSON con dos campos: `status` y `content`. Esto me permitió separar claramente los casos de éxito de los errores y facilitar la integración con el modelo de lenguaje, que posteriormente interpretará esta respuesta. Este diseño también me obliga a pensar en escenarios reales, como cuando un fármaco no existe o la API falla.

Otro aprendizaje clave fue el rol del prompt engineering. Entendí que el modelo no sabe automáticamente cómo usar esta función, por lo que necesita instrucciones explícitas. Diseñé un prompt que obliga al modelo a identificar el nombre del fármaco, traducirlo al inglés si es necesario y llamar correctamente a la función sin generar texto adicional. Por ejemplo:

```text
Eres un asistente experto en farmacología.

Tu tarea es identificar el nombre de un fármaco en la pregunta del usuario y llamar a la función:

get_drug_info(drug_name: string)

Reglas IMPORTANTES:
1. El nombre del fármaco debe estar en inglés
2. Usa nombres comunes internacionales (ej: "aspirin", "ibuprofen", "paracetamol")
3. NO expliques nada antes de llamar la función
4. SOLO devuelve la llamada a la función

Ejemplos:

Usuario: "Explícame la aspirina"
→ get_drug_info("aspirin")

Usuario: "Quiero saber sobre el ibuprofeno"
→ get_drug_info("ibuprofen")
```

Después de obtener la respuesta de la función, el siguiente paso es transformar esos datos en conocimiento útil. Para esto diseñé un segundo prompt que convierte la información cruda en una explicación pedagógica:

```text
Eres un profesor de farmacología.

Recibes información de un fármaco desde una API.

DATOS:
{resultado_funcion}

Si status = "error":
- Explica claramente el error al usuario

Si status = "success":
- Explica:
  1. Qué es el fármaco
  2. Qué significan sus propiedades químicas
  3. Para qué se usa
  4. Incluye una analogía sencilla

Hazlo claro, didáctico y progresivo.
```

A lo largo de este desarrollo entendí que el sistema no se compone solo de funciones o prompts aislados, sino de la interacción entre tres capas bien definidas: el modelo que interpreta la intención del usuario, el código que obtiene datos reales y el modelo nuevamente que traduce esos datos en una explicación comprensible. Esta separación de responsabilidades es lo que hace que el sistema sea robusto y escalable.

Finalmente, me quedó claro que lo que estoy construyendo no es simplemente un chatbot, sino un agente especializado. Este agente no solo responde preguntas, sino que decide cuándo consultar fuentes externas, cómo procesar la información y cómo presentarla de manera útil. Este cambio de perspectiva fue probablemente el aprendizaje más importante de todo el proceso.