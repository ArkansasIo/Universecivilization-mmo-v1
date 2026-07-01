INSERT OR IGNORE INTO regions (region_id, galaxy_id, name, region_code, x, y, z, notes)
SELECT 1, galaxy_id, 'Euclid Sample Region', 'EUCLID-SAMPLE-001', 0, 0, 0, 'Template region for player-discovered systems.'
FROM galaxies
WHERE number = 1;
