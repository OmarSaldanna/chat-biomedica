# Código para PubChem
import requests

url = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/aspirin/cids/JSON"

response = requests.get(url)

print("Status code:", response.status_code)

if response.status_code == 200:
    data = response.json()
    print("CID encontrado:")
    print(data)
else:
    print("Error:", response.text)

------------

# Código para ChEMBL
import requests

url = "https://www.ebi.ac.uk/chembl/api/data/molecule/CHEMBL25.json"

response = requests.get(url)

print("Status code:", response.status_code)

if response.status_code == 200:
    data = response.json()
    print("Información de la molécula:")
    print(data)
else:
    print("Error:", response.text)

------------

# Código para Protein Data Bank
import requests

url = "https://data.rcsb.org/rest/v1/core/entry/4HHB"

response = requests.get(url)

print("Status code:", response.status_code)

if response.status_code == 200:
    data = response.json()
    print("Información de la estructura:")
    print(data)
else:
    print("Error:", response.text)

------------

# Código para UniProt
import requests

url = "https://rest.uniprot.org/uniprotkb/P04637.json"

response = requests.get(url)

print("Status code:", response.status_code)

if response.status_code == 200:
    data = response.json()
    print("Información de la proteína:")
    print(data)
else:
    print("Error:", response.text)

------------

# Código para GenBank
import requests

url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"

params = {
    "db": "nuccore",
    "term": "BRCA1[gene] AND Homo sapiens[orgn]",
    "retmode": "json"
}

response = requests.get(url, params=params)

print("Status code:", response.status_code)

if response.status_code == 200:
    data = response.json()
    print("IDs encontrados:")
    print(data)
else:
    print("Error:", response.text)