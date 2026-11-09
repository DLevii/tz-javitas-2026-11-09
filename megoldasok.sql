1.feladat 


SELECT 
    termekek.id,
    termekek.nev,
    termekek.ar,
    termekek.keszlet,
    termekek.elerheto,
    kategoriak.nev AS kategoria_nev
FROM termekek
INNER JOIN kategoriak ON termekek.kategoria_id = kategoriak.id
ORDER BY termekek.ar ASC;

2.feladat

SELECT *
FROM termekek
WHERE elerheto = 1 AND keszlet > 0;

3.

SELECT *
FROM termekek
WHERE nev LIKE CONCAT('%', ?, '%');

4.

SELECT
    kategoriak.nev AS kategoria_nev,
    COUNT(termekek.id) AS termekek_szama,
    ROUND(AVG(termekek.ar), 1) AS atlagos_ar
FROM kategoriak
INNER JOIN termekek ON kategoriak.id = termekek.kategoria_id
GROUP BY kategoriak.id, kategoriak.nev;


5.
SELECT
    nev,
    ar,
    keszlet
FROM termekek
WHERE ar > 10000
ORDER BY keszlet DESC;