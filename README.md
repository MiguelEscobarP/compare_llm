#README
Manual de Usuario: Guía de Inicio Rápido

Esta sección proporciona una guía paso a paso para la configuración, despliegue y ejecución del sistema compare_llm. Su objetivo es permitir a los usuarios replicar los experimentos de comparación de Modelos de Lenguaje Grandes (LLMs) de manera eficiente.

Requisitos Previos
Antes de iniciar, asegúrese de tener las siguientes herramientas instaladas en su máquina (preferentemente en una Máquina Virtual con su Sistema Operativo, ej., Ubuntu Server 22.04 LTS):

Java Development Kit (JDK): Versión [Número de Versión, ej., 17 o superior].
Apache Maven: Versión [Número de Versión, ej., 3.8.6 o superior].
Node.js: Versión [Número de Versión, ej., 18.x o 20.x].
npm: Gestor de paquetes de Node.js (viene con Node.js).
Git: Para clonar el repositorio.
Configuración del Entorno
2.1. Clonar el Repositorio

Abra una terminal y ejecute el siguiente comando para clonar el proyecto desde GitHub:

git clone https://github.com/MiguelEscobarP/compare_llm.git
cd compare_llm

2.2. Configurar Claves de API

El sistema requiere claves de API para interactuar con los LLMs (Gemini, GPT, Deepseek).

Cree un archivo llamado .env en la raíz del directorio compare_llm.
Edite el archivo .env y añada sus claves de API con el siguiente formato:
GEMINI_API_KEY=su_clave_api_de_gemini_aqui
GPT_API_KEY=su_clave_api_de_gpt_aqui
DEEPSEEK_API_KEY=su_clave_api_de_deepseek_aqui

Importante: No comparta este archivo .env ni lo suba a control de versiones.

2.3. Preparar el Descriptor UML

Asegúrese de que el archivo uml_description.txt exista en la raíz del proyecto y contenga el diagrama de clases UML en formato PlantUML que desea utilizar como prompt para los LLMs.

Instalación de Dependencias del Proyecto
Una vez clonado el repositorio y configurado el archivo .env, instale las dependencias necesarias:

3.1. Dependencias de Node.js (JavaScript)

Desde la raíz del proyecto, ejecute:

npm install

Este comando descargará e instalará todas las librerías JavaScript definidas en package.json.

3.2. Dependencias de Maven (Java)

Desde la raíz del proyecto, ejecute:

mvn clean install

Este comando descargará las dependencias Java, compilará el código y construirá los artefactos necesarios para el proyecto.

Ejecución del Sistema de Comparación
Con todas las dependencias instaladas, puede iniciar el proceso de comparación de LLMs.

4.1. Iniciar el Experimento

Desde la raíz del proyecto, ejecute el script principal de Node.js. El sistema le pedirá el número de iteraciones a ejecutar.

node index.js

4.2. Seguimiento de la Ejecución

La consola mostrará el progreso de la generación de código y los errores de compilación para cada LLM. Tenga en cuenta que cada iteración implica una llamada a la API del LLM, lo que puede consumir su cuota de uso.

Interpretación de Resultados
Una vez que el sistema complete todas las iteraciones, los resultados se almacenarán en el directorio ./results/DDD-Extension.

5.1. Resultados Detallados por LLM

Dentro de ./results/DDD-Extension/, encontrará subcarpetas para cada LLM (ej., /gpt, /gemini, /deepseek). En cada una:

iteracionX.txt: Contiene la respuesta textual cruda obtenida de la API del LLM para la iteración X.
/pruebas/[nombre_llm]/iteracionX/: Dentro de este directorio (que se crea en ./pruebas), encontrará los archivos .java generados por el LLM para la iteración X, así como el archivo Main.java básico. Estos archivos pueden ser compilados y evaluados manualmente.
5.2. Resumen General de los Experimentos

Un resumen consolidado de todas las iteraciones se guarda en:

./results/DDD-Extension/resumen_iteraciones.txt

Este archivo proporciona métricas clave como:

Cantidad de creaciones correctas (compilación exitosa) por LLM.
Cantidad de errores de compilación por LLM.
Cantidad de iteraciones con estructura de clases esperada (conforme al UML).
Tiempos totales de ejecución por LLM.
Posibles Problemas y Soluciones
Errores de API: Asegúrese de que sus claves API en .env sean correctas y que no haya excedido las cuotas de uso de las APIs de los LLMs.
Errores de Compilación: El log en la consola indicará si el código generado por un LLM no compiló. Puede inspeccionar los archivos .java en ./pruebas/[nombre_llm]/iteracionX/ para depurar.
Problemas de Dependencias: Si npm install o mvn clean install fallan, verifique su conexión a internet y que las versiones de Node.js/npm y Maven sean las correctas.
