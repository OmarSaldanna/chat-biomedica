// Quick diagnostic for PDB APIs
// Run with: node test_pdb.mjs

async function testSearchPdb(term) {
  const url = "https://search.rcsb.org/rcsbsearch/v2/query";
  const query = {
    query: {
      type: "terminal",
      service: "text",
      parameters: { value: term },
    },
    return_type: "entry",
    request_options: { paginate: { start: 0, rows: 3 } },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(query),
  });

  console.log(`\n[search_pdb] term="${term}" → HTTP ${res.status}`);

  if (res.status === 204) {
    console.log("  → 204 No Content (sin resultados)");
    return null;
  }

  if (!res.ok) {
    const text = await res.text();
    console.log("  → Error body:", text.slice(0, 300));
    return null;
  }

  const data = await res.json();
  const results = data.result_set || [];
  console.log(`  → ${results.length} resultados:`, results.map((r) => r.identifier));
  return results[0]?.identifier || null;
}

async function testQueryPdb(pdbId) {
  const url = `https://data.rcsb.org/rest/v1/core/entry/${pdbId}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });

  console.log(`\n[query_pdb] pdb_id="${pdbId}" → HTTP ${res.status}`);

  if (!res.ok) {
    const text = await res.text();
    console.log("  → Error body:", text.slice(0, 300));
    return;
  }

  const data = await res.json();
  console.log("  → title:", data.struct?.title);
  console.log("  → resolution:", data.rcsb_entry_info?.resolution_combined);
  console.log("  → method:", data.exptl?.[0]?.method);
  console.log("  → authors:", data.rcsb_primary_citation?.rcsb_authors?.slice(0, 3));
  console.log("  → year:", data.rcsb_primary_citation?.year);
  console.log("  → pub_title:", data.rcsb_primary_citation?.title);
  console.log("  → mol_weight:", data.rcsb_entry_info?.molecular_weight);
  console.log("  → polymer_comp:", data.rcsb_entry_info?.polymer_composition);
}

(async () => {
  console.log("=== DIAGNÓSTICO RCSB PDB APIs ===\n");

  // Test 1: search with Spanish term
  const id1 = await testSearchPdb("hemoglobina humana");

  // Test 2: search with English term
  const id2 = await testSearchPdb("human hemoglobin");

  // Test 3: search insulin
  const id3 = await testSearchPdb("human insulin");

  // Test 4: search p53
  const id4 = await testSearchPdb("p53");

  // Test 5: direct query with known IDs
  await testQueryPdb("4HHB");
  await testQueryPdb("2MNR");

  // Test 6: query with result from search
  if (id1) await testQueryPdb(id1);
  if (id2 && id2 !== id1) await testQueryPdb(id2);

  console.log("\n=== FIN DIAGNÓSTICO ===");
})();
