# Bitácora de Desarrollo - Prácticum II

## 1. Inicio del Proyecto

Para la materialización de este proyecto, decidí desarrollar una página web en lugar de optar por una aplicación de escritorio o un software instalable. La principal razón de esta elección es la **versatilidad y accesibilidad** que nos brinda la web. Cualquier científico, investigador o estudiante, sin importar su sistema operativo o dispositivo, puede acceder a nuestra plataforma simplemente ingresando a una URL. Además, el despliegue y la actualización de una aplicación web es mucho más sencillo y transparente para el usuario final, evitando requerimientos de hardware restrictivos, la sobrecarga de instalar software y el problema de las versiones obsoletas.

En cuanto a la tecnología, elegí **Next.js** sobre una página web tradicional hecha únicamente con HTML, CSS y un poco de JavaScript. Next.js, apoyado en el entorno de **Node.js**, nos permite llevar el proyecto a un nivel mucho más robusto, profesional y escalable. Su capacidad para realizar renderizado del lado del servidor (SSR) o generación estática (SSG) no solo optimiza el rendimiento y la velocidad de la carga, sino que a nivel arquitectónico nos permite organizar nuestro sistema mediante componentes reutilizables y gestionar de manera muy limpia el enrutamiento y un futuro *backend*. Al tratarse de una plataforma que consultará y procesará datos complejos provenientes de diversas APIs biológicas y químicas, tener un motor reactivo como React (dentro de Next.js) nos garantiza un rendimiento excepcional al interactuar con el DOM.

Respecto a la propuesta gráfica, busqué un balance entre un aspecto tecnológico moderno y la seriedad que requiere el rigor científico. El diseño es sumamente formal, fuertemente orientado a la medicina, la biología y la química experimental. Para transmitir esto, opté por una paleta de colores sobre una base oscura y profesional (estilo modo oscuro o *dark mode* usando `slate-950`), la cual se ve acentuada con "resplandores" radiales (*ambient glows*) en tonos esmeralda y púrpura/índigo. Conceptualmente, estos tonos vibrantes emulando la bioluminiscencia o fluidos químicos refuerzan la estética moderna y biotecnológica del software.

## 2. Página de Inicio

Durante el desarrollo de la página de inicio (el *landing page* principal alojado en `page.tsx`), mi objetivo primario fue captar la atención del usuario inmediatamente, dejándole claro el propósito integral y solucionador de nuestra plataforma de bases de datos abiertas.

La página fue construida utilizando componentes estructurados y estilizados mediante **Tailwind CSS**. Implementé una tipografía sumamente limpia de perfil tecnológico pero amigable: **Inter**. Al ser importada y configurada directamente en el archivo base `layout.tsx` a través del módulo optimizado `next/font/google`, garantizamos legibilidad óptima para textos densos, sumando profesionalismo.

Uno de los elementos visuales que más resaltan en la sección intermedia de la pantalla inicial son las tarjetas que agrupan y describen las bases de datos (referenciadas en el código con la clase `glass-card`). Estas tarjetas y bloques de texto hacen uso de una técnica de diseño en tendencia llamada *Glassmorphism* (o efecto de cristal). Esto se logró aplicando fondos con color asimétrico oscuro pero traslúcido (`bg-slate-900/50`) a los cuales les añadimos un filtro de desenfoque (`backdrop-filter: blur(12px)`) y bordes muy sutiles, dándole al contenedor la apariencia de una lámina de cristal suspendida flotando en el espacio web.

Cada una de esas tarjetas de bases de datos exhibe un sutil degradado temático como fondo para diferenciar rápidamente la disciplina o el área de aplicación de cada fuente (por ejemplo, gradientes azulados para las químicas como PubChem, y naranjas y púrpuras para bases genómicas como PDB y UniProt). Asimismo, integré títulos llamativos valiendome de un gradiente de texto adaptado (`text-gradient`) construido en `globals.css`. Construir un bloque de UI como este involucró organizar de forma minuciosa los espacios en una cuadrícula (uso de CSS `grid` responsivo con `gap`), lo que garantiza que la disposición de la información fluya elegantemente en cualquier tamaño de pantalla.

## 3. Pruebas de APIs

Como parte crucial del análisis técnico, el acceso a repositorios de información biológica y química exige validar que los puentes de comunicación sean idóneos. Desarrollé un conjunto de implementaciones de prueba (scripts) en **Python** auxiliándome primariamente del módulo `requests`. Esto con el fin de consultar los *endpoints* oficiales, comprobar estatutos de respuesta (`HTTP 200 OK`) y analizar los JSON devueltos antes de realizar la integración formal en nuestra arquitectura web con Node.js.

Basado en la investigación previa plasmada en la documentación de `apis.md`, estos son los hallazgos y perspectivas de uso:

*   **PubChem (Compuestos y Farmacología):**
    Validamos la API REST PUG (`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/...`) realizando una consulta por nombre del compuesto usando "aspirin". Confirmamos la correcta extracción del `CID` (Compound ID).
    *   *Casos de uso:* Este *endpoint* será fundamental para que el sistema mapee nombres triviales a identificadores únicos y despliegue al momento propiedades moleculares, biológicas y toxicológicas para farmacólogos e investigadores clínicos.
    
*   **ChEMBL (Moléculas Bioactivas):**
    Realicé una solicitud directa al dominio del European Bioinformatics Institute (*EBI*) requiriendo el historial de una molécula (`CHEMBL25.json`).
    *   *Casos de uso:* La información obtenida de bioactividad experimental frente a dianas terapéuticas nos permitirá cruzar las referencias de sustancias químicas para modelar o deducir si un compuesto en específico tiene un potencial perfil de fármaco.

*   **Protein Data Bank / PDB (Estructuras Tridimensionales):**
    Probamos exitosamente el *endpoint* de la REST API core de la PDB solicitando una proteína de ejemplo (`4HHB`, que corresponde a la hemoglobina).
    *   *Casos de uso:* Los metadatos moleculares que obtenemos (átomos, cadenas asimétricas, citas del descubrimiento) complementarán la ficha técnica de macromoléculas en la web. Además, esto facilitará obtener los archivos tipo *PDB* que posibilitarán incluir librerías de visualización en 3D directo en la interfaz de usuario en el futuro.

*   **UniProt (Secuencias y Anotaciones):**
    Realizamos pruebas a sus servicios hospedados en la Knowledgebase, testeando directamente un ID de entrada ontológico como `P04637`.
    *   *Casos de uso:* UniProt sirve como la enciclopedia para entender la función de las proteínas. Al conectarla con nuestra plataforma, podremos mostrar la red de genes a las que pertenece la proteína, sus regiones y los procesos celulares en los que se encuentra involucrada. Especialmente valioso en investigación patológica.

*   **GenBank (Secuencias Genéticas):**
    Validamos uno de los servicios más imponentes: NCBI Entrez Programming Utilities (E-utilities), apuntando a `esearch.fcgi`. Para ello usé un motor de búsqueda programático mandando parámetros avanzados como: `"BRCA1[gene] AND Homo sapiens[orgn]"`.
    ```python
    # Fragmento testeado
    params = {
        "db": "nuccore",
        "term": "BRCA1[gene] AND Homo sapiens[orgn]",
        "retmode": "json"
    }
    ```
    *   *Casos de uso:* Confirmamos la capacidad de buscar correlaciones complejas (genes con organismos). A través del JSON retornado con secuencias de nucleótidos (ADN/ARN), permitiremos a biólogos moleculares de todo el mundo ubicar las secuencias precisas en estudios de medicina genómica desde una simple interfaz optimizada desarrollada en Next.js.

En síntesis, esta exploración y la creación del cliente en Next.js nos abren la puerta para establecer un ecosistema de datos centralizado, robusto y escalable de alto rigor científico.
