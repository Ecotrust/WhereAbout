-- Function: gwst_largest_poly_in_multipoly(text)

-- DROP FUNCTION gwst_largest_poly_in_multipoly(text);

CREATE OR REPLACE FUNCTION gwst_largest_poly_in_multipoly(multipoly text)
  RETURNS text AS
$BODY$

DECLARE
multipoly_geom geometry;
largest_poly geometry;
number_of_polygons integer;

BEGIN
	multipoly_geom := st_geometry(multipoly);

	IF (isempty(multipoly_geom)) THEN
		RETURN multipoly_geom;
	END IF;

	IF(GeometryType(multipoly_geom) = 'MULTIPOLYGON' OR
	   GeometryType(multipoly_geom) = 'POLYGON') THEN

		number_of_polygons := ST_NumGeometries(multipoly_geom);

		-- Check to see if this is a multipolygon, if so return the largest polygon in the collection, otherwise just return the polygon
		IF (number_of_polygons > 1) THEN

			-- set the largest polygon to the first in the collection	
			largest_poly := ST_GeometryN(multipoly_geom,1);

			-- loop through each polygon in the multipolygon to find the largest in the collection
			FOR i IN 1..number_of_polygons LOOP
				IF(area(ST_GeometryN(multipoly_geom,i)) > area(largest_poly)) THEN
					largest_poly := ST_GeometryN(multipoly_geom,i);
				END IF;
			END LOOP;

			RETURN astext(largest_poly);
		ELSE
			RETURN multipoly;
		END IF;
	ELSE
		RAISE EXCEPTION 'Invalid geometry type in gwst_largest_poly_in_multipoly.';
	END IF;

END;


$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION gwst_largest_poly_in_multipoly(text) OWNER TO postgres;
