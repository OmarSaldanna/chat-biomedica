# Casos de Uso — BioChat

Documento de casos de uso probados para las bases de datos integradas en el chat biomédico.
Cada caso incluye la pregunta realizada, las herramientas (function calls) que el sistema invocó automáticamente, y un resumen del resultado obtenido.

---

## UniProt — Proteínas

UniProt es la base de datos de secuencias de proteínas y anotaciones funcionales. BioChat la consulta mediante dos herramientas:
- **`search_proteins`**: Búsqueda general de proteínas por nombre, gen, función o enfermedad.
- **`get_protein_details`**: Obtiene información detallada de una proteína específica por su código de acceso.

### Caso 1: Consulta directa de una proteína clave

**Pregunta:** *"¿Qué hace la proteína p53 y qué enfermedades causa si muta?"*

**Herramientas invocadas:**
1. `search_proteins({ query: "p53" })` → Encontró 5 proteínas humanas, la primera: **Cellular tumor antigen p53** (P04637, Homo sapiens)
2. `get_protein_details({ accession: "P04637" })` → Detalles completos de p53

**Resultado:**
- **Nombre:** Cellular tumor antigen p53
- **Gen:** TP53
- **Organismo:** Homo sapiens (Human)
- **Secuencia:** 393 aminoácidos, 43.7 kDa
- **Localización subcelular:** Cytoplasm, Nucleus, PML body, Endoplasmic reticulum, Mitochondrion matrix, Centrosome
- **Función biológica:** Factor de transcripción multifuncional que induce arresto del ciclo celular, reparación del ADN o apoptosis
- **Enfermedades asociadas:** Cáncer de esófago, Síndrome de Li-Fraumeni, Carcinoma de células escamosas de cabeza y cuello, Cáncer de pulmón, Papiloma del plexo coroideo, Carcinoma adrenocortical, Carcinoma basocelular 7, Síndrome de fallo de médula ósea 5

**Respuesta del chat:**
> La proteína **p53**, conocida como el "guardián del genoma", es una proteína crucial en la regulación del ciclo celular y la respuesta al daño del ADN.
>
> **Nivel básico:** Imagina que p53 actúa como un guardián en una fábrica (la célula). Si hay algún fallo (daño en el ADN), p53 detiene la producción para hacer reparaciones o decide si es mejor apagar la fábrica (apoptosis).
>
> **Nivel intermedio:** p53 es un factor de transcripción que puede inducir la detención del ciclo celular, la reparación del ADN o la apoptosis dependiendo de las condiciones.
>
> **Nivel avanzado:** Funciona interaccionando con otros elementos de la maquinaria celular. Puede activar genes pro-apoptóticos (como BAX) y suprimir genes anti-apoptóticos (como Bcl-2).
>
> **Enfermedades:** Si p53 no funciona correctamente debido a mutaciones, las células pueden proliferar sin control → Síndrome de Li-Fraumeni, cáncer de esófago, carcinomas...

---

### Caso 2: Búsqueda exploratoria por enfermedad

**Pregunta:** *"¿Qué proteínas humanas están involucradas en la enfermedad de Alzheimer?"*

**Herramientas invocadas:**
1. `search_proteins({ query: "Alzheimer", limit: 5, organism: "human" })`

**Resultado — 5 proteínas encontradas:**
| # | Proteína | Gen | Accession |
|---|----------|-----|-----------|
| 1 | Collagen alpha-1(XXV) chain | COL25A1 | Q9BXS0 |
| 2 | Amyloid-beta precursor protein | APP | P05067 |
| 3 | Nucleosome-remodeling factor subunit BPTF | BPTF | Q12830 |
| 4 | Sortilin-related receptor | SORL1 | Q92673 |
| 5 | Apolipoprotein E | APOE | P02649 |

**Respuesta del chat:**
> Listado claro de las 5 proteínas con sus genes y accessions, sugiriendo al usuario que puede pedir detalles de cualquier proteína específica.

---

### Caso 3: Búsqueda por gen específico (BRCA1)

**Pregunta:** *"Busca proteínas relacionadas con BRCA1"*

**Herramientas invocadas:**
1. `search_proteins({ query: "BRCA1" })`

**Resultado — 5 proteínas encontradas:**
| # | Proteína | Gen | Accession |
|---|----------|-----|-----------|
| 1 | Breast cancer type 1 susceptibility protein | BRCA1 | P38398 |
| 2 | Fanconi anemia group J protein | BRIP1 | Q9BX63 |
| 3 | Lys-63-specific deubiquitinase BRCC36 | BRCC3 | P46736 |
| 4 | Integrator complex assembly factor BRAT1 | BRAT1 | Q6PJG6 |
| 5 | BRCA1-A complex subunit Abraxas 1 | ABRAXAS1 | Q6UWZ7 |

---

### Caso 4: Detalles de insulina

**Pregunta (implícita vía API directa):** Detalles de la proteína P01308

**Herramientas invocadas:**
1. `get_protein_details({ accession: "P01308" })`

**Resultado:**
- **Nombre:** Insulin
- **Gen:** INS
- **Organismo:** Homo sapiens (Human)
- **Secuencia:** 110 aminoácidos, 12.0 kDa
- **Localización subcelular:** Secreted
- **Función biológica:** Disminuye la concentración de glucosa en sangre. Incrementa la permeabilidad celular a monosacáridos, aminoácidos y ácidos grasos. Acelera la glucólisis...
- **Enfermedades asociadas:** Hiperproinsulinemia, Diabetes mellitus tipo 1 (tipo 2), Diabetes mellitus neonatal permanente 4, MODY 10
- **Palabras clave:** Alternative splicing, Carbohydrate metabolism, Diabetes mellitus, Disulfide bond

---

## ChEMBL — Fármacos

ChEMBL es la base de datos de compuestos bioactivos y fármacos del EMBL-EBI. BioChat la consulta mediante:
- **`get_drug_info`**: Busca información química de un fármaco por su nombre en inglés (INN).

### Caso 5: Propiedades de la metformina

**Pregunta:** *"¿Qué propiedades químicas tiene la metformina?"*

**Herramientas invocadas:**
1. `get_drug_info({ drug_name: "metformin" })`

**Resultado:**
| Propiedad | Valor |
|-----------|-------|
| Nombre | METFORMIN |
| CHEMBL ID | CHEMBL1431 |
| Fórmula molecular | C₄H₁₁N₅ |
| Peso molecular | 129.17 g/mol |
| LogP (lipofilia) | -1.03 |
| Fase clínica máxima | 4 (aprobada) |
| Uso terapéutico | Sí |
| Tipo de molécula | Small molecule |

**Respuesta del chat:**
> La metformina tiene un LogP de -1.03 lo que indica que es hidrofílica (se disuelve más en agua que en lípidos). Peso molecular de 129.17 g/mol, relativamente pequeña, lo que facilita su absorción. Fase clínica 4 = aprobada para uso clínico.

---

### Caso 6: Flujo combinado — UniProt + ChEMBL

**Pregunta:** *"¿Qué es la insulina, dónde se encuentra en la célula, y qué propiedades químicas tiene la metformina?"*

**Herramientas invocadas (en paralelo):**
1. `search_proteins({ query: "insulin" })` → Encontró Insulin (P01308, INS, Homo sapiens)
2. `get_drug_info({ drug_name: "metformin" })` → Datos químicos de la metformina

**Resultado:**
> El sistema cruzó ambas bases de datos en una sola respuesta:
>
> **Insulina:** Hormona vital que regula los niveles de glucosa en sangre. Producida por las células beta del páncreas. Localización: Secreted (se secreta al torrente sanguíneo).
>
> **Metformina:** Fórmula C₄H₁₁N₅, peso 129.17 g/mol, LogP -1.03 (hidrofílica), fase clínica 4 (aprobada). Se utiliza para tratar la diabetes tipo 2.
>
> **Analogía:** La insulina es como una llave que abre las puertas de las células para que entre la glucosa. La metformina es un ayudante que mejora la eficiencia de esas llaves.

---

## Resumen de Capacidades Probadas

| Capacidad | Base de datos | Estado |
|-----------|--------------|--------|
| Búsqueda de proteínas por nombre | UniProt | ✅ Funcional |
| Búsqueda de proteínas por enfermedad | UniProt | ✅ Funcional |
| Búsqueda de proteínas por gen | UniProt | ✅ Funcional |
| Detalles completos de proteína | UniProt | ✅ Funcional |
| Localización subcelular | UniProt | ✅ Funcional (corregido) |
| Enfermedades asociadas | UniProt | ✅ Funcional (corregido) |
| Filtro por organismo (humano por defecto) | UniProt | ✅ Funcional (corregido) |
| Encadenamiento search → details | route.ts | ✅ Funcional (corregido) |
| Consulta de fármacos por nombre | ChEMBL | ✅ Funcional |
| Propiedades químicas (fórmula, peso, LogP) | ChEMBL | ✅ Funcional |
| Flujo combinado UniProt + ChEMBL | Ambas | ✅ Funcional |

## Bugs Corregidos en esta Sesión

1. **Resultados irrelevantes en búsqueda** — La búsqueda devolvía proteínas de perro, pez cebra, etc. Se añadió filtro `organism_id:9606` (humano) y `reviewed:true` (Swiss-Prot).
2. **Localización subcelular siempre "No disponible"** — El código buscaba `comment.texts` pero la API usa `comment.subcellularLocations[].location.value`.
3. **Enfermedades siempre "No disponible"** — El código buscaba `comment.texts` pero la API usa `comment.disease.diseaseId`.
4. **Encadenamiento de herramientas roto** — La segunda llamada a OpenAI no incluía `tools`, impidiendo el flujo `search_proteins` → `get_protein_details`. Se implementó un loop de hasta 3 rondas.
