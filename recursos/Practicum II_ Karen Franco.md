Universidad Anáhuac México Norte 

![Logotipo, Gráfico de proyección solarDescripción generada automáticamente][image1]

**Prácticum II**

Diseño de una Plataforma Integrada de Bases de Datos Abiertas para Compuestos Biológicos 

Karen Anneth Franco Llamas

Asesor: Sergio Barrientos Ramírez

Beneficiario: Laboratorio de Bioinstrumentación

Huixquilucan, Estado de México                                                                   Febrero 2026

Contenido  
[CAPITULO I PROTOCOLO DE INVESTIGACIÓN	3](#capitulo-i-protocolo-de-investigación)

[Introducción	4](#introducción)

[Antecedentes	7](#antecedentes)

[2.1 Problemática	8](#2.1-problemática)

[2.2 Objetivos	9](#2.2-objetivos)

[2.3 Justificación	9](#2.3-justificación)

[2.4 Normativas	10](#2.4-normativas)

[2.5 Líneas de conocimiento	11](#2.5-líneas-de-conocimiento)

[2.6 Alcance	12](#2.6-alcance)

[2.7 Restricciones	12](#2.7-restricciones)

[Metodología	13](#metodología)

[3.1 Metodología	14](#3.1-metodología)

[3.2 Diagrama de Ghantt	15](#3.2-diagrama-de-ghantt)

[CAPITULO II Identificación y clasificación de bases de datos.	16](#capitulo-ii-identificación-y-clasificación-de-bases-de-datos.)

[4.1 Antecedentes	17](#4.1-antecedentes)

[4.2 Objetivo Específico	20](#4.2-objetivo-específico)

[4.3 Metodología	20](#4.3-metodología)

[4.4 Resultados	23](#4.4-resultados)

[4.5 Discusión	29](#4.5-discusión)

[Conclusiones	31](#conclusiones)

[En este parte del proyecto hice la identificación, clasificación y evaluación técnica de bases de datos biológicas abiertas que serán relevantes para el desarrollo de la plataforma integrada de bases de datos sobre compuestos biológicos. En la búsqueda inicial encontré nueve bases de datos relacionadas con información química y biológica, sin embargo, después de revisar aspectos como el acceso, las herramientas disponibles y las condiciones de uso, seleccioné las cinco bases de datos que cumplen con los criterios definidos para el proyecto: PubChem, ChEMBL, Protein Data Bank (PDB), UniProt y GenBank.	31](#conclusiones)

[Referencias	31](#referencias)

# CAPITULO I PROTOCOLO DE INVESTIGACIÓN {#capitulo-i-protocolo-de-investigación}

# Introducción  {#introducción}

El desarrollo de plataformas integradas de bases de datos abiertas para compuestos biológicos tiene como fundamento la integración de la bioinformática, la gestión eficiente de datos científicos y la aplicación de tecnologías emergentes de inteligencia artificial. En la actualidad, el crecimiento exponencial de datos biológicos nos ha obligado a replantear los modelos tradicionales de almacenamiento y consulta de información científica. Este exceso de datos en biociencias ha obligado a crear sistemas organizados que no solo guarden la información, sino que la conecten de manera clara, eficiente y que pueda reproducirse sin problemas.

Una base de datos puede definirse como un conjunto organizado de información estructurada que permite su almacenamiento, recuperación y actualización de manera eficiente mediante sistemas de gestión especializados. En el contexto científico, las bases de datos no solo almacenan datos, sino que también integran metadatos, relaciones semánticas y esquemas estructurados que facilitan el análisis computacional. En el campo de los compuestos biológicos, el crecimiento acelerado de información estructural, genética y farmacológica ha impulsado la creación de repositorios abiertos como el Protein Data Bank (PDB) \[1\], UniProt \[2\] y PubChem \[3\], que permiten el acceso libre a datos biomoleculares a nivel mundial.  Estos recursos han demostrado que la disponibilidad abierta de información acelera la investigación y fortalece la reproducibilidad científica.

Sin embargo, el hecho de que existan varios repositorios independientes provoca fragmentación y dificultades para que los datos se integren entre sí. Para enfrentar este problema, los principios FAIR (Findable, Accessible, Interoperable, Reusable), propuestos por Wilkinson et al.\[4\], establecen lineamientos que aseguran que los datos científicos puedan localizarse, accederse y reutilizarse bajo estándares comunes. En este contexto, la interoperabilidad implica utilizar formatos estructurados, ontologías compartidas y modelos de datos compatibles, elementos clave para diseñar una plataforma integrada que unifique información proveniente de distintas fuentes.

En el campo químico y farmacológico, herramientas como SciFinder han demostrado lo importante que son los sistemas de búsqueda estructural y semántica para impulsar el descubrimiento científico.\[5\] Estas plataformas utilizan lenguajes de consulta avanzados, como los basados en Query Search Language (QSL), que permiten realizar búsquedas por subestructura molecular, similitud o relaciones bibliográficas complejas. A diferencia de los buscadores tradicionales de texto libre, estos sistemas permiten hacer consultas lógicas y relacionales, lo cual es fundamental para analizar compuestos biológicos y su comportamiento experimental.

Más recientemente, los modelos de lenguaje de gran escala (LLM) han empezado a utilizarse como una interfaz inteligente entre el usuario y las bases de datos científicas. Investigaciones como la de Brown \[6\] et al. y desarrollos posteriores en modelos entrenados con literatura científica \[7\] demuestran que estos sistemas pueden transformar preguntas en lenguaje natural en consultas estructuradas. Esto facilita el acceso a información compleja sin que el usuario necesite dominar lenguajes técnicos o formales.

Por ello, una Plataforma Integrada de Bases de Datos Abiertas para Compuestos Biológicos no solo debería concentrar información bajo los principios FAIR, sino también integrar herramientas inteligentes que mejoren la interacción, el análisis y la generación de conocimiento en biotecnología y ciencias farmacéuticas.

# Antecedentes  {#antecedentes}

## 2.1 Problemática {#2.1-problemática}

Uno de los desafíos más importantes que enfrentan los estudiantes e investigadores es la disponibilidad y calidad de la información a la que pueden acceder para respaldar su trabajo. Aunque hoy en día hay muchos datos en Internet, no siempre provienen de fuentes confiables y no siempre tienen la calidad académica adecuada. Esta situación genera problemas como información incorrecta o engañosa, uso de bases de datos con registros incompletos o mal estructurados y dependencia de múltiples fuentes no especializadas para completar la recuperación de datos, lo que afecta negativamente el aprendizaje, la calidad de la investigación y el desarrollo del conocimiento.

Una investigación exhaustiva sobre la integridad de las bases de datos muestra que la presencia de publicaciones de baja calidad o de explotación en ciertos repositorios de literatura puede hacer que las revisiones de la literatura incluyan información incompleta o poco confiable como evidencia científica, lo que debilita la validez de los análisis y las conclusiones obtenidas de estas búsquedas. El estudio advierte que el uso de fuentes que no han sido revisadas por pares o que tienen una confiabilidad cuestionable puede reducir la credibilidad de la literatura académica y conducir a evaluaciones deficientes de la evidencia científica. \[8\]

La calidad de los datos es un elemento fundamental en cualquier proceso de investigación. Las bases de datos que contienen información parcial, desactualizada o con errores en los registros dificultan la recopilación de conocimiento confiable porque los datos pueden no reflejar fielmente la realidad o pueden faltar elementos importantes que permitan una interpretación precisa. Los principios de calidad de los datos estipulan que la información debe ser precisa, confiable, consistente y adecuada para el uso previsto. Estas condiciones no siempre se cumplen en los casos en que la base de datos está mal gestionada o no cumple con los estándares de calidad. \[9\]

Asimismo, la necesidad de consultar múltiples bases de datos para obtener una cobertura más amplia de información ha sido reconocida en el ámbito académico, pero esto puede implicar un mayor esfuerzo de búsqueda, dificultades de integración de resultados y contradicciones entre fuentes, lo que confunde a los estudiantes y hace más compleja la obtención de un estado del arte coherente. Si bien la revisión sistemática recomienda complementar la consulta en diversas bases para una mayor exhaustividad, este enfoque también aumenta la probabilidad de encontrar información duplicada, irrelevante o de baja calidad si no se emplean criterios metodológicos robustos. \[10\]

Por otro lado, las barreras tecnológicas y estructurales también limitan el acceso efectivo a bases de datos de alta calidad. Muchos repositorios especializados tienen acceso limitado o requieren registro institucional, lo que significa que los estudiantes sin acceso deben utilizar motores de búsqueda genéricos o fuentes no confiables para recopilar información relacionada con su trabajo académico. Esta situación crea dependencia de fuentes no especializadas, aumenta la ineficacia de los métodos de búsqueda y reduce la eficacia del proceso de investigación. \[11\]

En consecuencia, la problemática del acceso a bases de datos no fidedignas y las malas prácticas de información representan un desafío sustancial para los estudiantes universitarios, ya que comprometen la calidad de su aprendizaje, la validez de sus investigaciones y su capacidad para construir conocimiento científico riguroso. Este escenario evidencia la importancia de desarrollar soluciones tecnológicas que permitan centralizar el acceso a fuentes de datos confiables y estructuradas, al mismo tiempo que fomenten buenas prácticas de gestión y uso de la información.

## 2.2 Objetivos  {#2.2-objetivos}

**Objetivo general**

Desarrollar y validar una plataforma digital interoperable que integre bases de datos abiertas de compuestos biológicos.

**Objetivos particulares**

1. Identificar y clasificar bases de datos abiertas relevantes. 

2. Diseñar un modelo de interoperabilidad basado en identificadores biológicos e implementar un motor de búsqueda estructural con inteligencia artificial.

3. Desarrollar interfaz web y validar la plataforma

## 2.3 Justificación  {#2.3-justificación}

La transformación digital y el crecimiento acelerado del volumen de datos han impactado de manera significativa tanto la investigación científica como los procesos de enseñanza en disciplinas como la bioinformática. Este campo interdisciplinario, que articula conocimientos de biología, informática, estadística y matemáticas, requiere del uso de información biológica confiable y bien estructurada para llevar a cabo análisis rigurosos, generar nuevos conocimientos y garantizar una formación académica sólida. No obstante, la dispersión de la información en múltiples repositorios, plataformas y servicios con características heterogéneas representa un desafío considerable para estudiantes, docentes e investigadores que demandan un acceso eficiente y seguro a datos validados.

La coexistencia de numerosas bases de datos científicas, cada una con formatos, estándares y mecanismos de acceso distintos, obliga a los usuarios a consultar diversas fuentes para recopilar la información necesaria. Esta dinámica no sólo incrementa el tiempo y esfuerzo requeridos para la búsqueda de datos, sino que también complica su integración, comparación y reutilización, afectando la realización de análisis sistemáticos y reproducibles. Diversos estudios en la literatura especializada coinciden en que la falta de interoperabilidad entre fuentes de datos biológicos constituye una limitación relevante en bioinformática, ya que provoca redundancia en los procesos de búsqueda y reduce la calidad de los resultados obtenidos cuando la información no puede ser combinada de manera eficiente.

En este contexto, la consolidación de bases de datos biológicas en una plataforma centralizada se presenta como una alternativa viable para optimizar el acceso a información científica, disminuir duplicidades y simplificar la consulta de conjuntos de datos relevantes. Este enfoque permitiría reducir la fragmentación en los procesos de búsqueda y, en consecuencia, mejorar la productividad académica y de investigación. Asimismo, una plataforma centralizada posibilita la aplicación de criterios homogéneos de control y calidad de datos, 

garantizando que los recursos disponibles cuenten con respaldo científico adecuado, lo cual resulta fundamental para evitar interpretaciones erróneas derivadas del uso de información incompleta o poco confiable.

De igual forma, los aspectos relacionados con la seguridad de la información y el control de acceso adquieren especial relevancia en el diseño de este tipo de plataformas. La implementación de mecanismos de autenticación, autorización y gestión de permisos permite asegurar que únicamente los usuarios autorizados puedan acceder o modificar información sensible. Esto es particularmente importante en entornos académicos y de investigación donde se manejan datos sujetos a restricciones éticas, legales o institucionales. Un sistema centralizado facilita la adopción de políticas de seguridad consistentes, la protección de datos personales y el cumplimiento de estándares internacionales de gestión de información científica.

Finalmente, el desarrollo de una plataforma que centralice bases de datos biológicas representa un beneficio estratégico para la institución académica, al consolidarse como un espacio de referencia para el acceso y la gestión del conocimiento. Este tipo de infraestructura fomenta la colaboración entre distintas áreas académicas, impulsa el intercambio científico y puede convertirse en un recurso institucional clave para el desarrollo de proyectos de investigación conjuntos. Asimismo, contribuye al fortalecimiento del programa académico de bioinformática, promoviendo la generación de resultados científicos confiables, reproducibles y de alta calidad.

## 2.4 Normativas {#2.4-normativas}

La implementación de una plataforma que centralice información de bases de datos, especialmente en contextos académicos y de investigación como la bioinformática, debe respetar un conjunto de normativas, estándares y marcos de gobernanza que regulan el tratamiento, almacenamiento, integración y protección de datos. Estas normativas buscan garantizar la seguridad, privacidad y derechos de los titulares de la información, así como promover la interoperabilidad entre sistemas y la calidad de los datos administrados. 

Por mencionar algunas:

* **Principios FAIR (Findable, Accessible, Interoperable, Reusable)**: Son lineamientos internacionales para la correcta gestión de datos científicos. Buscan que la información sea localizable, accesible mediante protocolos abiertos, compatible con otros sistemas y reutilizable con metadatos y licencias claras. En una plataforma de compuestos biológicos, aseguran que los datos no solo se almacenen, sino que realmente puedan integrarse y reutilizarse.  
    
* **ISO/IEC 27001 — Sistema de Gestión de Seguridad de la Información**: Establece los requisitos para proteger la información mediante un sistema estructurado de gestión de seguridad. Garantiza confidencialidad, integridad y disponibilidad de los datos, mediante control de accesos, gestión de riesgos y prevención de incidentes.  
* **ISO 25012— Modelo de Calidad de Datos:** Define criterios para evaluar la calidad de los datos, como exactitud, consistencia, completitud y actualización. Permite asegurar que la información almacenada en la plataforma sea confiable y adecuada para su reutilización científica.  
* **ISO 15836 — Dublin Core Metadata Element Set:** Estándar internacional para describir recursos digitales mediante metadatos estructurados (autor, fecha, identificador, formato, etc.). Facilita la organización, búsqueda e interoperabilidad de información dentro de sistemas digitales.  
* **Ley General en Materia de Humanidades, Ciencias, Tecnologías e Innovación:** Regula la política nacional en ciencia y tecnología, promoviendo el acceso abierto, la ciencia abierta y la reutilización del conocimiento científico. Respaldaría legalmente el desarrollo de plataformas abiertas de datos científicos en México.

La aplicación de la ISO/IEC 27001, ISO 25012 e ISO 15836 (Dublin Core), junto con la Ley General en Materia de Humanidades, Ciencias, Tecnologías e Innovación, garantiza que la plataforma de datos biológicos cumpla con estándares de seguridad, calidad y correcta organización de la información. Estas normativas aseguran la protección de los datos, su confiabilidad y adecuada estructuración mediante metadatos, además de respaldar el acceso abierto y la colaboración científica en el ámbito nacional.

## 2.5 Líneas de conocimiento  {#2.5-líneas-de-conocimiento}

En este proyecto abarca las líneas de conocimiento de informática médica y aplicación de la IA en ingeniería biomédica. Por un lado, la informática médica se enfoca en el uso de tecnologías de la información para la adquisición, almacenamiento, gestión y análisis de datos biomédicos y clínicos. Por otro lado, la inteligencia artificial se integra directamente como una herramienta para procesar, organizar y analizar grandes volúmenes de información biológica, permitiendo la búsqueda inteligente, el reconocimiento de patrones y el apoyo a la toma de decisiones en contextos biomédicos. La implementación de IA sobre bases de datos biológicas facilita la interpretación de información científica, la comparación de resultados experimentales y la optimización de procesos en el desarrollo, evaluación y uso de dispositivos y tecnologías biomédicas.

Materias como bioinformática, algoritmos y programación forman un fuerte sustento para la creación de este proyecto. Por su parte Bioinformática introduce la naturaleza, estructura y complejidad de los datos biológicos que se pretenden gestionar. A través de esta materia se adquiere comprensión sobre los distintos tipos de información biológica, tales como secuencias genómicas, anotaciones funcionales, perfiles de expresión y metadatos asociados, así como sobre las principales bases de datos utilizadas en el ámbito académico y de investigación.

Por otro lado, Algoritmos y programación aporta s herramientas técnicas necesarias para la construcción de la plataforma desde el punto de vista computacional. Esta asignatura permite desarrollar habilidades en el diseño de algoritmos eficientes, la implementación de estructuras de datos, la gestión de procesos de consulta y la optimización del acceso a la información.

## 2.6 Alcance  {#2.6-alcance}

El proyecto contempla el diseño y desarrollo de una plataforma digital dirigida a la gestión de datos biológicos, la cual permitirá centralizar información proveniente de diversas bases de datos especializadas. Esta centralización busca reducir la dispersión de información y facilitar el acceso unificado a recursos científicos que actualmente se encuentran dispersos en distintos repositorios. Así también, la plataforma incorporará mecanismos avanzados de búsqueda y filtrado que permitirán realizar consultas. Finalmente, se integrarán herramientas de inteligencia artificial capaces de interpretar consultas en lenguaje natural y transformarlas en búsquedas técnicas dentro del sistema, optimizando la recuperación de información y mejorando la experiencia del usuario en entornos de investigación científica.

## 2.7 Restricciones  {#2.7-restricciones}

Las principales restricciones del proyecto se relacionan con la dependencia de fuentes externas y la heterogeneidad de los datos. La plataforma no tendrá control directo sobre la estructura, actualización o disponibilidad de las bases de datos biológicas integradas, adicionalmente, existen restricciones técnicas y operativas asociadas al tiempo de desarrollo (tres meses), la capacidad de infraestructura computacional disponible y el alcance funcional de una versión beta. El motor de búsqueda estructural deberá equilibrar precisión y eficiencia computacional, lo que puede limitar inicialmente la complejidad de algoritmos de similitud o análisis avanzado. Finalmente, al tratarse de una plataforma académica en fase inicial, su escalabilidad, robustez de seguridad y experiencia de usuario estarán condicionadas por los recursos humanos y tecnológicos disponibles durante la etapa de implementación.

# Metodología  {#metodología}

## 3.1 Metodología {#3.1-metodología}

**1\. Identificación y clasificación de bases de datos abiertas relevantes**

**1.1 Búsqueda y selección de fuentes**  
Localizar bases de datos abiertas relacionadas con compuestos y datos biológicos, priorizando repositorios reconocidos, con acceso público y veracidad.

**1.2 Clasificación por tipo de dato y utilidad**  
Organizar las bases seleccionadas por categorías como: estructura, secuencia, interacción, literatura, bioactividad, indicando qué aporta cada una, qué formato maneja y qué tan actualizable es.

**1.3 Evaluación técnica de acceso e integración**  
Revisar métodos de acceso (API, descargas masivas, formatos), restricciones de uso y/o licencias, y disponibilidad de metadatos para definir cuáles son viables para integrarse en una plataforma unificada.

**2\. Diseño de un modelo de interoperabilidad basado en identificadores biológicos**

**2.1 Diseño del sistema**  
Se define la arquitectura de la plataforma, incluyendo el motor de búsqueda, las bases de datos y los módulos de inteligencia artificial.

**2.2 Implementación del procesamiento con IA**  
La información biomédica se procesa mediante modelos de inteligencia artificial para generar representaciones semánticas que permiten búsquedas inteligentes.

**2.3 Desarrollo de la plataforma web**

Se integra el motor de búsqueda con una interfaz web que permite a los usuarios realizar consultas y visualizar resultados.

**3\. Validación de la plataforma con usuarios** 

**3.1 Evaluación técnica del sistema**  
Se realizan pruebas para verificar el correcto funcionamiento, precisión de búsqueda y tiempos de respuesta.

**3.2 Pruebas con usuarios**  
La plataforma es utilizada por alumnos del laboratorio de bioinstrumentación en escenarios reales de búsqueda de información.

**3.3 Análisis de resultados**  
Se analizan los datos obtenidos para evaluar la utilidad, eficiencia y aceptación de la plataforma.

## 3.2 Diagrama de Ghantt {#3.2-diagrama-de-ghantt}

![GráficoEl contenido generado por IA puede ser incorrecto.][image2]

# CAPITULO II Identificación y clasificación de bases de datos. {#capitulo-ii-identificación-y-clasificación-de-bases-de-datos.}

## 4.1 Antecedentes  {#4.1-antecedentes}

En las últimas décadas, el avance de la biología molecular junto con la bioinformática y la ciencia de datos ha disparado la cantidad de información científica disponible. Gracias a tecnologías como la secuenciación masiva, la proteómica y el análisis estructural, hoy generamos volúmenes de datos tan grandes que el verdadero reto es saber cómo almacenarlos y organizarlos para que sean útiles. Por eso han aparecido tantas bases de datos biológicas; funcionan como repositorios donde se centraliza todo sobre genes, proteínas, compuestos químicos y estructuras. Esto permite que tanto investigadores como estudiantes podamos aprovechar información que ya existe para nuevos análisis, lo que no solo acelera el conocimiento, sino que facilita un montón el trabajo entre diferentes disciplinas. \[14\].

Hoy en día, las bases de datos biológicas abiertas son prácticamente la infraestructura que sostiene la investigación científica. Su meta es organizar volúmenes masivos de datos de forma estructurada para que podamos consultarlos, analizarlos y, sobre todo, volver a usarlos. A diferencia de una base de datos convencional, estos repositorios mezclan información de muchas fuentes experimentales distintas, creando sistemas súper complejos y conectados. El problema es que tanta diversidad trae retos técnicos pesados: la información está regada en distintas plataformas, con formatos y esquemas de metadatos que no siempre encajan, lo que hace que integrarlas directamente en sistemas computacionales sea todo un desafío\[15\].

Con todo este movimiento de la ciencia abierta, han surgido un montón de repositorios públicos que dejan los datos biológicos al alcance de cualquiera. Pero para que toda esa información sirva de algo y no sea un caos, se crearon reglas internacionales de gestión. El estándar más importante es el de los principios FAIR (*Findable, Accessible, Interoperable and Reusable*). Básicamente, dicen que los datos tienen que ser fáciles de encontrar, accesibles con protocolos abiertos, capaces de conectarse entre sistemas usando estándares comunes y, sobre todo, que se puedan volver a usar gracias a que tienen metadatos claros y licencias bien definidas. Hoy en día, si quieres saber si una base de datos es buena o si te va a servir para un proyecto de integración, lo primero que haces es checar si cumple con estos principios \[16\].

Entre las bases de datos biológicas que más se usan están las que guardan información sobre compuestos químicos y cómo reaccionan biológicamente. Una de las más pesadas es PubChem, del NCBI. Esta plataforma tiene datos de millones de compuestos, sustancias y bioensayos, pero lo que la hace realmente útil es que no solo te da la estructura química, sino que la conecta con genes, proteínas, artículos científicos y rutas metabólicas. Gracias a que todo está integrado, puedes ver fácilmente cómo se relacionan las entidades químicas con las biológicas, lo que la vuelve indispensable para el descubrimiento de fármacos, la biología química y el análisis computacional \[17\].

Otra base de datos clave en el área farmacológica y biológica es ChEMBL, que se enfoca específicamente en moléculas bioactivas con actividad probada en laboratorio. Lo que hace ChEMBL es recopilar datos sobre cómo interactúan los compuestos químicos con sus blancos biológicos, incluyendo detalles de ensayos experimentales, valores de bioactividad y propiedades químicas. Toda esta información es fundamental cuando estás diseñando nuevos fármacos, porque te permite ver la relación directa entre la estructura de un compuesto y su respuesta biológica, lo que ayuda un montón a identificar candidatos terapéuticos prometedores \[18\].

Si hablamos de estructuras biológicas, el referente indiscutible es el Protein Data Bank (PDB), donde se guardan los modelos tridimensionales de macromoléculas como proteínas y ácidos nucleicos. Estos modelos vienen de técnicas experimentales pesadas como la cristalografía de rayos X, la resonancia magnética nuclear (RMN) o la microscopía crioelectrónica. Lo que nos aporta el PDB es vital: nos deja estudiar a fondo cómo se organizan las biomoléculas en el espacio para entender realmente cómo interactúan las proteínas con ligandos y otros componentes de la célula \[19\].

Para poder analizar sistemas biológicos a fondo, también necesitamos conocer las secuencias y funciones de las proteínas. Ahí es donde entra **UniProt**, que es básicamente la base de datos más robusta para encontrar secuencias anotadas. Lo bueno de UniProt es que te da todo el paquete: funciones biológicas, dominios estructurales, evidencia experimental y conexiones directas con otros repositorios. Tener toda esa información integrada nos facilita muchísimo el estudio de la función proteica y nos ayuda a entender mejor cómo se relacionan la secuencia, la estructura y la actividad biológica \[20\].

En cuanto a las secuencias genéticas, estas son otro pilar básico de la investigación. El referente aquí es GenBank, que lo gestiona el NCBI y es de los repositorios más grandes de secuencias nucleotídicas. Lo interesante es que GenBank no trabaja solo; forma parte de una red internacional llamada INSDC, lo que asegura que siempre haya un intercambio de datos fluido con el archivo europeo (ENA) y el de Japón (DDBJ). Gracias a este trabajo en equipo, cualquier secuencia genómica que se genere en el mundo termina integrada en una infraestructura global, lo que nos facilita muchísimo el acceso a la información \[21\].

Otro componente de los más importantes dentro del medio de datos biológicos es la literatura científica, que constituye la principal fuente de evidencia experimental. Plataformas como PubMed nos permiten acceder a millones de artículos científicos relacionados con biología, química y medicina. Además de funcionar como repositorios bibliográficos, estas plataformas ofrecen herramientas para integrar la literatura con datos biológicos, facilitando el análisis automatizado de información científica mediante minería de texto y enlaces a data sets experimentales \[22\].

A pesar de la gran cantidad de información disponible, uno de los principales retos en el uso de bases de datos biológicas es la heterogeneidad de los datos. Cada base de datos utiliza diferentes formatos de representación, esquemas de metadatos y estructuras de almacenamiento. Por ejemplo, las secuencias biológicas suelen almacenarse en formatos como FASTA, las estructuras tridimensionales en formatos PDB o mmCIF, mientras que las estructuras químicas pueden representarse mediante notaciones como SMILES o InChI. Esta diversidad de formatos dificulta la integración directa de la información dentro de plataformas de análisis unificadas \[15\].

Otro aspecto bastante importante en el análisis de bases de datos biológicas es la forma en que los usuarios o los sistemas pueden acceder a la información almacenada. Muchas plataformas de hoy en día nos ofrecen mecanismos de acceso automatizados mediante Interfaces de Programación de Aplicaciones (APIs: Application Programming Interfaces). Una API es un conjunto de reglas y protocolos que permite que diferentes sistemas informáticos se comuniquen entre sí de manera automatizada. En el contexto de las bases de datos biológicas, las APIs nos permiten que programas, scripts o plataformas de análisis puedan consultar, recuperar y procesar información directamente desde los repositorios sin necesidad de realizar consultas manuales a través de interfaces web \[23\].

Normalmente y por lo general, las APIs funcionan mediante solicitudes que se envían a través de internet utilizando protocolos como HTTP o HTTPS, donde el sistema realiza una petición específica al servidor que contiene la base de datos. El servidor procesa la solicitud y devuelve la información solicitada en formatos estructurados como JSON, XML o CSV, los cuales pueden ser interpretados fácilmente por programas computacionales. Este tipo de acceso resulta de suma importancia para proyectos de bioinformática y análisis de datos biológicos, ya que nos permite automatizar la obtención de información, actualizar data sets de forma periódica y poder combinar datos provenientes de múltiples fuentes dentro de una misma plataforma de análisis.

Además del acceso mediante APIs, algunas bases de datos también permiten descargas masivas de datos (bulk downloads), lo que facilita la obtención de grandes volúmenes de información para análisis locales. La disponibilidad de APIs, descargas estructuradas, documentación técnica y metadatos adecuados constituye un criterio fundamental para poder evaluar la viabilidad de integrar una base de datos dentro de una plataforma unificada de análisis biológico.

Debido a estos desafíos, tiene que ser necesario realizar procesos sistemáticos de identificación, clasificación y evaluación técnica de las bases de datos biológicas que hay disponibles. La clasificación por tipo de información como estructura, secuencia o bioactividad nos permite comprender qué tipo de datos nos aporta cada repositorio y cuál puede ser su utilidad dentro de un sistema integrado. También, evaluar aspectos técnicos como métodos de acceso, disponibilidad de APIs, formatos de datos, metadatos y restricciones de licencia resulta fundamental para determinar qué bases de datos son viables para su integración dentro de una plataforma unificada de análisis biológico.

De esta forma, la identificación y la categorización de bases de datos biológicas de acceso abierto representa un elemento fundamental para el desarrollo de infraestructuras de información que permitan utilizar de manera eficiente los datos disponibles.. Un análisis adecuado de estos recursos no solo facilita la selección de fuentes confiables, sino que también permite diseñar estrategias de integración que favorezcan la interoperabilidad, la actualización continua de los datos y el desarrollo de nuevas herramientas de análisis en biología computacional.

## 4.2 Objetivo Específico  {#4.2-objetivo-específico}

1. Identificar y clasificar bases de datos abiertas relevantes. 

   1.1 Búsqueda y selección de fuentes

   1.2 Clasificación por tipo de dato y utilidad

   1.3 Evaluación técnica de acceso e integración

## 4.3 Metodología {#4.3-metodología}

**1.1 Búsqueda y selección de fuente**

En la primera etapa se realizó una búsqueda de bases de datos biológicas disponibles en línea que contuvieran información relacionada con compuestos químicos, proteínas, estructuras biológicas y secuencias genéticas. La búsqueda se realizó consultando documentación oficial de bases de datos biológicos, artículos científicos relacionados con bioinformática y portales especializados en recursos biológicos.

Como punto de partida, se definieron los criterios que debían cumplir las bases de datos para ser consideradas dentro del proyecto. Los criterios que se establecieron fueron los siguientes: que la base de datos estuviera disponible en línea, que tuviera acceso público o abierto, que contuviera información biológica o química relevante, que contara con documentación oficial, y que ofreciera mecanismos técnicos para consultar o recuperar datos.

Durante esta búsqueda se identificaron inicialmente nueve bases de datos biológicas que contienen información relacionada con compuestos químicos y datos biológicos y que se me hicieron de suma importancia y relevantes. Las bases de datos identificadas fueron las siguientes:

PubChem, ChEMBL, Protein Data Bank (PDB), UniProt, GenBank, Reaxys, DrugBank, Cortellis Drug Discovery Intelligence, Integrity Database.

Después se realizó una revisión general de cada una de estas bases de datos para poder  identificar sus características principales, el tipo de información que contienen, su disponibilidad de acceso y las herramientas técnicas que ofrecen para consultar los datos.

Después de este análisis inicial se determinó que algunas de estas bases de datos no cumplían con los criterios establecidos para este proyecto. Para ser más exactos, Reaxys, Cortellis Drug Discovery Intelligence e Integrity Database requieren una suscripción institucional o licencias comerciales para poder acceder a sus datos, lo que limita su uso en plataformas abiertas. En el caso de DrugBank, aunque ofrece acceso público limitado, el acceso completo a sus datasets requiere licencias comerciales.

Debido a estas restricciones, estas bases de datos no fueron consideradas para el análisis principal del proyecto. Como resultado, se seleccionaron cinco bases de datos que cumplen con los criterios de acceso abierto y disponibilidad de herramientas técnicas para consulta automatizada. Las bases de datos seleccionadas fueron: PubChem, ChEMBL, Protein Data Bank (PDB), UniProt y GenBank

Estas cinco bases de datos fueron utilizadas en las siguientes etapas del análisis.

**1.2 Clasificación por tipo de dato y utilidad**

Después de definir las cinco bases de datos con las que se iba a trabajar, se realizó el proceso de clasificación por tipo de dato y utilidad. Esta etapa se llevó a cabo para ordenar la información contenida en cada base de datos según la naturaleza de sus registros y según el tipo de aporte que puede representar dentro de un sistema de integración de datos biológicos.

Para poder realizar esta parte, primero se volvió a ingresar al sitio oficial de cada una de las cinco bases de datos seleccionadas. En cada plataforma se revisaron de manera específica tres apartados: la descripción general de la base de datos, la estructura de los registros disponibles, y la documentación o guía de organización de datos.

Después, dentro de cada base de datos se consultaron registros individuales. La revisión de estos registros se hizo con el fin de poder observar cómo es que se presenta la información, qué campos aparecen en cada entrada, qué identificadores utiliza cada plataforma y qué elementos forman parte de cada registro.

Durante esta revisión de registros se documentó para cada base de datos: el tipo de entidad principal almacenada, el identificador principal de cada registro, los campos descriptivos incluidos, el tipo de información biológica o química asociada, y la forma en que la plataforma organiza internamente esos datos.

Después de revisar los registros y la documentación, se definieron las categorías de clasificación que se iban a utilizar en esta etapa. Las categorías de trabajo establecidas fueron las siguientes: compuestos químicos y bioactividad, estructuras biológicas, secuencias de proteínas, secuencias genéticas.

Con estas categorías ya definidas, pude después clasificar una por una las cinco bases de datos seleccionadas.

La primera que revise fue PubChem. En esta base de datos se consultaron registros de compuestos químicos para observar el contenido de cada entrada, su organización y los identificadores utilizados. También se revisaron las secciones relacionadas con propiedades moleculares, estructuras químicas y bioensayos.

Después me pase a ChEMBL. En este caso se consultaron registros de moléculas, registros relacionados con actividad biológica y registros asociados a blancos biológicos. 

Posteriormente revisé Protein Data Bank (PDB). En esta base se consultaron registros de estructuras tridimensionales para identificar los campos incluidos en cada entrada, los archivos asociados a las estructuras y la forma en que la información estructural está organizada.

Ya después me pase a UniProt. En este caso analicé registros de proteínas para observar la secuencia, el identificador del registro, la información funcional, los datos del organismo y las secciones de anotación asociadas a cada entrada.

Por último, revisé GenBank. En esta vez se consultaron registros de secuencias nucleotídicas para identificar la forma en que se presenta la secuencia, el identificador de acceso, los metadatos del registro y la estructura general de la información biológica contenida en cada entrada.

Una vez completada la revisión de contenido, estructura de registros, identificadores y formatos, se organizó la información recopilada por base de datos y por categoría de dato para dejar establecida la clasificación metodológica de trabajo.

**1.3 Evaluación técnica de acceso e integración**

Después de realizar la clasificación de las bases de datos que seleccione, se hizo la evaluación técnica de los métodos de acceso disponibles en cada una de ellas. Para esta etapa se trabajó con las cinco bases de datos seleccionadas: PubChem, ChEMBL, Protein Data Bank (PDB), UniProt y GenBank.

Primero inicie ingresando al sitio oficial de cada base de datos. Una vez dentro de cada plataforma, se revisaron las secciones de documentación técnica para identificar si contaban con herramientas de acceso programático. Durante esta revisión se buscaron apartados relacionados con API, Web Services o documentación para desarrolladores.

Posteriormente se realizó una búsqueda específica de la API correspondiente a cada base de datos, revisando la documentación disponible para identificar cómo se pueden realizar consultas automáticas a los datos. En esta revisión también se observaron los parámetros de consulta, los identificadores utilizados por cada base de datos y los ejemplos de uso proporcionados en la documentación.

Finalmente, se verificó el correcto funcionamiento de las APIs identificadas mediante la elaboración de un código en lenguaje Python, el cual realizó una solicitud a cada API. Posteriormente, se analizó la respuesta generada por el servicio; si la salida obtenida correspondía a la información esperada y se recibía sin errores, se confirmó que la API operaba de manera correcta y que era posible acceder a sus datos de forma adecuada.

## 4.4 Resultados  {#4.4-resultados}

Como resultado para la primera parte del proceso de búsqueda inicial de repositorios biológicos, se identificaron nueve bases de datos relacionadas con compuestos químicos, estructuras biológicas y secuencias genéticas. Las bases de datos encontradas durante esta etapa fueron:

PubChem, ChEMBL, Protein Data Bank (PDB), UniProt, GenBank, Reaxys, DrugBank, Cortellis Drug Discovery Intelligence, Integrity Database

Posteriormente se revisaron las características generales de cada una de estas plataformas, incluyendo sus condiciones de acceso, disponibilidad de documentación técnica y herramientas para consulta de datos.

Después de esta revisión se definió un conjunto de cinco bases de datos para el análisis del proyecto, las cuales cumplen con las características de acceso abierto y disponibilidad de herramientas técnicas para recuperación de información. Las bases de datos seleccionadas fueron:

PubChem, ChEMBL, Protein Data Bank (PDB), UniProt, GenBank.

![][image3]

Figura 1\. Vista Principal de la Base de Datos PubChem

![][image4]

Figura 2\. Vista Principal de la Base de Datos ChEMBL

![][image5]

Figura 3\. Vista Principal de la Base de Datos Protein Data Bank

![][image6]

Figura 4\. Vista Principal de la Base de Datos UniProt

![][image7]

Figura 5\. Vista Principal de la Base de Datos GenBank

Una vez establecida la selección final, se realizó la clasificación de estas bases de datos según el tipo de información biológica que contienen.

| Base de datos | Tipo de información |
| :---- | :---- |
| **PubChem** | Compuestos químicos, propiedades moleculares y bioensayos |
| **ChEMBL** | Compuestos bioactivos y datos de bioactividad experimental |
| **Protein Data Bank (PDB)** | Estructuras tridimensionales de proteínas y macromoléculas biológicas |
| **UniProt** | Secuencias de proteínas y anotaciones funcionales |
| **GenBank** | Secuencias genéticas de ADN y ARN |

Tabla 1\. Clasificación según el tipo de información

Durante la revisión de las bases de datos también se identificaron los formatos principales en los que se presentan o almacenan los datos biológicos dentro de estas plataformas.

Los formatos observados incluyen:

* FASTA: utilizado para representar secuencias biológicas.

* PDB y mmCIF: utilizados para almacenar estructuras tridimensionales de proteínas.

* SMILES e InChI:  utilizados para representar estructuras químicas de compuestos.

* JSON y XML: utilizados como formatos de respuesta en consultas realizadas mediante APIs.

Finalmente, durante la evaluación técnica de acceso se identificaron las interfaces de programación de aplicaciones (APIs) disponibles en cada una de las bases de datos seleccionadas.

| Base de datos | API identificada | Explicación |
| :---- | :---- | :---- |
| PubChem | PubChem PUG-REST API | Una API HTTP que permite consultar datos químicos mediante URLs estructuradas y recibir los resultados en formatos como JSON o XML. |
| ChEMBL | REST API | REST API que permite consultar compuestos, bioactividad, targets y ensayos farmacológicos en formatos como JSON. |
| Protein Data Bank (PDB) | RCSB PDB API | RCSB Data API          permite acceder programáticamente a estructuras 3D de proteínas, ligandos, cadenas y ensamblajes biológicos.  |
| UniProt | UniProt REST API | UniProt REST API, que permite consultar secuencias proteicas, funciones, organismos y anotaciones biológicas.  |
| GenBank | NCBI Entrez E-utilities API | NCBI E-utilities API, que permite buscar, descargar y analizar secuencias genéticas mediante herramientas como esearch, efetch y esummary.  |

Tabla 2\. Bases de datos con sus APIs identificadas.

Estas APIs permiten realizar consultas automatizadas a los datos contenidos en cada repositorio y recuperar información en formatos estructurados.

Y posteriormente se corroboro que cada una de las APIS funcionaran con un código en Python:

PubChem:

![][image8]

Figura 6\. Código y resultado del recuesta a la API en Python de PubChem

ChEMBL:

![][image9]

Figura 7\. Código y resultado del recuesta a la API en Python de ChEMBL

Protein Data Bank:

![][image10]

Figura 8\. Código y resultado del recuesta a la API en Python de Protein Data Bank

UniProt:

![][image11]

Figura 9\. Código y resultado del recuesta a la API en Python de UniProt 

GenBank:

![][image12]

Figura 10\. Código y resultado del recuesta a la API en Python de GenBank

## 4.5 Discusión {#4.5-discusión}

Los resultados que se obtuvieron en este capítulo nos muestran que aunque existe una gran cantidad de bases de datos relacionadas con compuestos y datos biológicos no todas cumplen con las características necesarias para integrarse dentro de una plataforma abierta para análisis científico. Durante la búsqueda inicial se identificaron nueve bases de datos que potencialmente nos servirían; sin embargo, después del proceso de revisión técnica solo cinco pudieron cumplir con los criterios establecidos para el proyecto: PubChem, ChEMBL, Protein Data Bank (PDB), UniProt y GenBank. 

Uno de los factores más importantes que influyó en la selección de estas bases de datos fue el acceso abierto a todos los datos. Bases de datos como Reaxys, Cortellis Drug Discovery Intelligence e Integrity Database requieren suscripciones institucionales o licencias comerciales para poder acceder a su contenido, lo que nos limita su uso dentro de plataformas abiertas de investigación. De manera similar como DrugBank aunque nos ofrece cierta información pública esta nos restringe el acceso completo a sus conjuntos de datos mediante licencias comerciales. Estas limitaciones hacen que dichas bases de datos no sean adecuadas ni posibles de utilizarse para un sistema que busca integrar información accesible y reutilizable dentro de un entorno académico.

En conjunto las cinco bases de datos que fueron seleccionadas presentan características que favorecen su integración dentro de sistemas computacionales de análisis biológico. Todas estas nos ofrecen acceso abierto a su información, cuentan con documentación técnica pública y permiten el acceso automatizado a los datos mediante Interfaces de Programación de Aplicaciones (APIs). La disponibilidad de estas APIs es un aspecto fundamental para el desarrollo de manera íntegra de las plataformas integradas, ya que nos permite que los sistemas se puedan consultar y poder recuperar información de manera automática sin depender de las consultas manuales.

Otro aspecto que es muy importante que se puede observar en los resultados es que cada una de las bases de datos que fueron seleccionadas nos aportan un tipo de información biológica distinto, lo cual nos demuestra la naturaleza complementaria de estas bases de datos. Por ejemplo, PubChem y ChEMBL se enfocan en información relacionada con compuestos químicos y bioactividad experimental, mientras que Protein Data Bank nos proporciona información estructural tridimensional de proteínas. Por otra parte UniProt nos ofrece secuencias de proteínas junto con anotaciones funcionales y GenBank almacena secuencias genéticas de ADN y ARN. Esta variedad de información hace notar que ninguna base de datos por sí sola puede cubrir u almacenar todos los tipos de datos biológicos necesarios para el análisis completo de compuestos y sistemas biológicos.

Los resultados también muestran la diversidad en los formatos de datos empleados por las bases de datos biológicas, incluyendo formatos como FASTA para secuencias biológicas, PDB o mmCIF para estructuras tridimensionales, y representaciones químicas como SMILES e InChI. Esta variedad de formatos nos confirma uno de los principales desafíos mencionados en los antecedentes del proyecto: la dificultad de integrar datos provenientes de múltiples fuentes que utilizan estructuras y estándares diferentes.

La presencia de APIs en todas las bases de datos seleccionadas es un elemento demasiado importante para resolver parcialmente este problema de integración. Las APIs nos permiten recuperar información en formatos estructurados como JSON o XML, lo cual nos facilita el procesamiento automático de los datos y su incorporación dentro de plataformas de análisis computacional. Por otro lado la validación de estas APIs mediante solicitudes realizadas en Python nos demostró que los servicios responden correctamente y nos permiten acceder libremente a la información almacenada en cada repositorio.

## Conclusiones {#conclusiones}

En este parte del proyecto hice la identificación, clasificación y evaluación técnica de bases de datos biológicas abiertas que serán relevantes para el desarrollo de la plataforma integrada de bases de datos sobre compuestos biológicos. En la búsqueda inicial encontré nueve bases de datos relacionadas con información química y biológica, sin embargo, después de revisar aspectos como el acceso, las herramientas disponibles y las condiciones de uso, seleccioné las cinco bases de datos que cumplen con los criterios definidos para el proyecto: PubChem, ChEMBL, Protein Data Bank (PDB), UniProt y GenBank. 

El análisis que pude hacer me permitió ver que estas bases de datos nos ofrecen distintos tipos de información biológica que se complementan entre sí. PubChem y ChEMBL están más orientadas a compuestos químicos y datos de bioactividad experimental, mientras que Protein Data Bank aporta información estructural tridimensional de macromoléculas. Por otro lado UniProt contiene secuencias de proteínas junto con sus anotaciones funcionales y GenBank por último reúne secuencias genéticas de ADN y ARN. Esta variedad nos confirma que el conocimiento biológico está distribuido en varias bases de datos, lo que nos vuelve a confirmar la importancia de contar con una herramienta que integre toda esta información en una sola plataforma.

Por otro lado, también durante la evaluación técnica identifiqué que las cinco bases de datos seleccionadas cuentan con interfaces de programación de aplicaciones, lo que nos permite acceder de manera libre y automatizada a sus datos. Para poder comprobarlo, realicé diferentes solicitudes en Python y pude confirmar que es posible recuperar información de cada repositorio mediante consultas programáticas lo cual nos facilita mucho su integración en las aplicaciones computacionales.

En conclusión los resultados que obtuve en este capítulo me permiten establecer una base sólida para el desarrollo de la plataforma que se propone ya que se identificaron fuentes de datos confiables, accesibles e integrables entre sí. La disponibilidad de APIs junto con la diversidad de la información biológica proporcionada por las bases de datos seleccionadas es un elemento clave para el desarrollo de un sistema capaz de consultar múltiples repositorios y centralizar información relevante para el análisis de compuestos biológicos.

## Referencias {#referencias}

\[1\] R. C. Burley et al., “RCSB Protein Data Bank: powerful new tools for exploring 3D structures of biological macromolecules,” *Nucleic Acids Research*, vol. 49, no. D1, pp. D437–D451, 2021\.

\[2\] The UniProt Consortium, “UniProt: the Universal Protein Knowledgebase in 2023,” *Nucleic Acids Research*, vol. 51, no. D1, pp. D523–D531, 2023\.

\[3\] S. Kim et al., “PubChem 2023 update,” *Nucleic Acids Research*, vol. 51, no. D1, pp. D1373–D1380, 2023\.

\[4\] T. Liu et al., “BindingDB in 2024: a FAIR knowledgebase of protein–small molecule binding data,” *Nucleic Acids Research*, vol. 53, no. D1, 2024\.

\[5\] M. D. Wilkinson et al., “The FAIR Guiding Principles for scientific data management and stewardship,” *Scientific Data*, vol. 3, 2016\.

\[6\] CAS, “SciFinderⁿ: Advanced Research Discovery Application,” Chemical Abstracts Service, 2023\.

\[7\] S. Singhal et al., “Large Language Models Encode Clinical Knowledge,” *Nature*, vol. 620, pp. 172–180, 2023\.

\[8\] Hassenstein, M. J., & Vanella, P. (2022). Data Quality—Concepts and Problems. *Encyclopedia*, *2*(1), 498-510. https://doi.org/10.3390/encyclopedia2010032

\[9\] Bramer, W.M., Rethlefsen, M.L., Kleijnen, J. *et al.* Optimal database combinations for literature searches in systematic reviews: a prospective exploratory study. *Syst Rev* **6**, 245 (2017). [https://doi.org/10.1186/s13643-017-0644-y](https://doi.org/10.1186/s13643-017-0644-y)

\[10\] National Research Council (US) Board on Biology; Pool R, Esnayra J, editors. Bioinformatics: Converting Data to Knowledge: Workshop Summary. Washington (DC): National Academies Press (US); 2000\. Barriers to the Use of Databases. Available from: [https://www.ncbi.nlm.nih.gov/books/NBK44936](https://www.ncbi.nlm.nih.gov/books/NBK44936).

\[11\] Protección de Datos conforme al reglamento RGPD. (2022). Retrieved from [https://europa.eu/youreurope/business/dealing-with-customers/data-protection/data-protection-gdpr/index\_es.htm](https://europa.eu/youreurope/business/dealing-with-customers/data-protection/data-protection-gdpr/index_es.htm).

\[12\] ISO/IEC 27001:2022. (2022). Retrieved from [https://www.iso.org/standard/27001](https://www.iso.org/standard/27001).

\[13\] Marco legal o normativo para la compartición y almacenamiento de información en la UNAM. (n.d.). Retrieved from [https://www.red-tic.unam.mx/index.php/marco-legal](https://www.red-tic.unam.mx/index.php/marco-legal).

\[14\] P. C. Boutros et al., “Globalizing and integrating big data in biomedical research,” *Nature Reviews Genetics*, vol. 16, no. 10, pp. 587–598, 2022\.

\[15\] R. Durinx et al., “Identifying ELIXIR Core Data Resources,” *F1000Research*, vol. 5, 2023\.

\[16\] M. D. Wilkinson et al., “The FAIR guiding principles for scientific data management and stewardship,” *Scientific Data*, vol. 3, 2023\.

\[17\] S. Kim et al., “PubChem 2023 update: improved access to chemical data,” *Nucleic Acids Research*, vol. 51, pp. D1373–D1380, 2023\.

\[18\] A. Gaulton et al., “The ChEMBL database in 2024: bioactivity data for drug discovery,” *Nucleic Acids Research*, vol. 52, pp. D1180–D1187, 2024\.

\[19\] S. K. Burley et al., “RCSB Protein Data Bank: enabling research and education through biological macromolecular structures,” *Nucleic Acids Research*, vol. 53, pp. D564–D573, 2025\.

\[20\] The UniProt Consortium, “UniProt: the universal protein knowledgebase in 2025,” *Nucleic Acids Research*, vol. 53, pp. D609–D617, 2025\.

\[21\] D. A. Benson et al., “GenBank,” *Nucleic Acids Research*, vol. 51, pp. D47–D50, 2023\.

\[22\] D. Szklarczyk et al., “STRING database in 2023: protein–protein association networks,” *Nucleic Acids Research*, vol. 51, pp. D638–D646, 2023\.

\[23\] R. T. Fielding, “Architectural styles and the design of network-based software architectures,” University of California, Irvine. 