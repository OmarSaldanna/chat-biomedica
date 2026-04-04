Durante el desarrollo del chat biomédico, tras haber implementado con éxito la consulta de fármacos mediante ChEMBL, me di cuenta de una gran oportunidad. La aplicación ya era capaz de buscar medicamentos, pero los estudiantes de biomedicina, biología o medicina también necesitan interactuar frecuentemente con proteínas. Quería crear el mejor tutor de biomédica, y el siguiente paso lógico era integrar información sobre proteínas. Así nació el segundo caso de uso: el Tutor Inteligente de Proteínas utilizando la base de datos de UniProt.

El desafío inicial me fue planteado con un script de Python en crudo que consultaba UniProt. Tenía dos funciones clave: `search_proteins(query)` para hacer una especie de "búsqueda en Google" de proteínas relacionadas, y `get_protein_details(accession)` para obtener información profunda de una en específico a partir de su ID. 

El script original en Python lucía así:

```python
import requests

BASE_URL = "https://rest.uniprot.org/uniprotkb"

def search_proteins(query, limit=5):
    url = f"{BASE_URL}/search"
    params = {"query": query, "format": "json", "size": limit}
    response = requests.get(url, params=params)
    data = response.json()
    
    results = []
    for entry in data.get("results", []):
        protein_name = entry["proteinDescription"]["recommendedName"]["fullName"]["value"]
        gene = entry.get("genes", [{}])[0].get("geneName", {}).get("value", "N/A")
        organism = entry["organism"]["scientificName"]
        accession = entry["primaryAccession"]
        
        results.append({
            "accession": accession, "nombre": protein_name,
            "gen": gene, "organismo": organism
        })
    return results

def get_protein_details(accession):
    url = f"{BASE_URL}/{accession}.json"
    response = requests.get(url)
    data = response.json()
    # ... extracción de datos ...
```

Este código era científicamente correcto, pero topé con un problema enorme que identifiqué rápidamente: la información cruda que arroja UniProt **no sirve para enseñar directamente**. La API te da un muro de texto técnico denso, con múltiples referencias a publicaciones (tipo PubMed) y terminología extremadamente compleja (por ejemplo: "Multifunctional transcription factor… apoptosis… BAX… CDK…"). 

Como mi objetivo era hacer un producto educativo real —un tutor—, tuve una epifanía sobre la arquitectura de este sistema: **la API no enseña, solo da datos**. El valor pedagógico real lo tiene que aportar el LLM, actuando como un puente entre la ciencia cruda y el conocimiento digerible. 

Traduciendo esta idea al ecosistema de Next.js y TypeScript de mi proyecto, decidí mantener la misma arquitectura modular que había usado para los fármacos. Creé dos nuevos archivos dentro de la carpeta de funciones del agente: `searchProteins.ts` y `getProteinDetails.ts`.

Para la búsqueda general (`searchProteins.ts`), el desafío tecnológico fue migrar las peticiones de `requests` de Python a la API nativa `fetch` de JS/TS, garantizando el parseo correcto de una estructura JSON profunda y el manejo de errores:

```typescript
export async function handler(args: { query: string; limit?: number }) {
  const { query, limit = 5 } = args;
  const url = new URL("https://rest.uniprot.org/uniprotkb/search");
  url.searchParams.set("query", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("size", String(limit));

  const response = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  // ... validación y formateo de resultados ...
}
```

El verdadero nivel de producto se logró en el diseño del prompt de `getProteinDetails.ts`. Entendí que necesitaba que el agente explicara las proteínas en niveles progresivos. Así estructuré la instrucción o `systemPromptSection` para esta herramienta:

```text
## Detalles de proteína desde UniProt (get_protein_details)

Reglas:
1. Necesitas el código de acceso (accession ID) de UniProt. Si no lo tienes, usa primero search_proteins para encontrarlo.

3. Cuando recibas el resultado de esta función, transforma la información científica cruda en conocimiento educativo:
   a) Resume la función en una sola frase clara
   b) Explica la proteína en 3 niveles:
      - Nivel básico: Usa analogías simples (como "guardián", "interruptor")
      - Nivel intermedio: Explica su rol biológico real 
      - Nivel avanzado: Describe mecanismos celulares o moleculares específicos
   c) Extrae y explica SOLO los conceptos importantes (ignora ruido técnico innecesario)
   d) Añade: ¿Por qué es importante en medicina? y ¿Qué pasa si falla esta proteína?
   e) Termina con: 1 pregunta tipo examen y 1 analogía memorable.
```

Este diseño de prompt fue la clave. Convirtió una simple llamada a API en una herramienta magistral de enseñanza. Al probarlo, el sistema fue capaz de manejar un flujo lógico de dos pasos ("router encadenado") de forma completamente autónoma. 

Por ejemplo, al pedirle en el chat: *"Busca proteínas relacionadas con apoptosis"*, el LLM llamó automáticamente a `search_proteins` y la API devolvió cinco candidatos (PAWR, BIRC5, ATG5, AIFM3, Cd5l). Luego, al indagar por los detalles de **BIRC5**, el LLM usó su ID (O15392) llamando a `get_protein_details`. La magia fue ver cómo en lugar del denso JSON original, la interfaz me desplegó una explicación estructurada: me dio una analogía simple presentándola como un "filtro de seguridad", fue detallando progresivamente el mecanismo celular de esta proteína, explicó su peso médico en terapias contra el cáncer, e incluso lanzó una pregunta de reflexión al estilo universitario.

El proceso de desarrollo me solidificó cómo se deben armar los productos basados en AI:

1. **API (UniProt)**: Aporta los datos científicos confiables y curados.
2. **TypeScript (Backend)**: Filtra y da estructura manejable al caos del JSON.
3. **LLM (Prompts)**: Ejecuta la enseñanza adaptativa, dotando a la data fría de contexto útil.
4. **Chat (Frontend)**: Da la interfaz amigable.

Terminando el flujo e integrando tanto las proteínas (UniProt) como los fármacos (ChEMBL) bajo el mismo archivo `index.ts`, me percaté de que el proyecto maduró de ser un buscador a transformarse en todo un tutor interactivo multi-dominio. El siguiente salto natural será dotarlo de la capacidad de enrutamiento inteligente total ("router automático") para que orqueste la llamada entre medicamentos, componentes genéticos y proteínas sin sudar una gota.
