-- Function: gwst_clip_shape_to_shoreline(text, integer)

-- DROP FUNCTION gwst_clip_shape_to_shoreline(text, integer);

CREATE OR REPLACE FUNCTION gwst_clip_shape_to_shoreline(IN shape_geometry_text text, IN shape_srid integer, OUT overlaps_shoreline boolean, OUT clipped_shape geometry)
  RETURNS record AS
$BODY$
  DECLARE

	rec record;  
	sa_srid integer;  -- study area srid
	shape_geometry geometry;  --shape geometry as geometry object
	sa_geom geometry; --study area geometry
	intersected_geometry geometry;  --the intersection of new shape geometry and a study area geometry
	number_of_sa integer;  --counter for number of study area geometries intersected by shape

  BEGIN

	-- convert geometry text to object
	shape_geometry := (select ST_GeomFromText(shape_geometry_text, shape_srid));
  

	--Because we want to compare polygon relationships, we need to confirm that the user's shape
	--is in same srid as study areas.  Use st_transform to ensure proper "st_intesects" behavior.
	--
	--  NOTE: we will transform the user's shape geometry, and not the study area geometries because the study areas
	--        are likely to be more complex, and therefore more expensive to transform.
	sa_srid = (SELECT srid FROM geometry_columns WHERE f_table_name = 'gwst_region');
	shape_geometry = st_transform(shape_geometry, sa_srid);  

	--Check to see which study areas the new shape intersects
	--NOTE: the following approach assumes that we need to consider the case where a single new shape
	--      intersects multiple study areas.  If this is true, then we need to intersect the shape
	--      with each study area individually, otherwise "st_intersection" will choke
	--
	-- Start by initializing a counter for number of study areas intersected by user shape,
	number_of_sa := 0;
	overlaps_shoreline := FALSE;

	--Intersect each study area geometry with the shape geometry.  
	FOR rec IN SELECT a.the_geom FROM "gwst_shoreline" a WHERE st_intersects(shape_geometry, the_geom) LOOP
		sa_geom := rec.the_geom;
		
		--Note that by checking for NULL study area geometries we can catch the case where the shape doesn't intersect any study areas
		--Note that by checking for the geometry type we can confirm that the intersection doesn't produce a non-poly type geometry
		IF (sa_geom IS DISTINCT FROM NULL AND (geometrytype(sa_geom) = 'POLYGON' OR geometrytype(sa_geom) = 'MULTIPOLYGON')) THEN
			overlaps_shoreline := TRUE;
			intersected_geometry := (SELECT st_intersection(shape_geometry,(SELECT st_difference(shape_geometry, sa_geom))));

			--Note that new.geometry_clip = the set of intersected geometries between the user's shape and study areas.
			--So... for the first study area, just update new.geometry_clip to the intersected geometry
			--Otherwise, intesection to create the new clipped geometry 

			IF number_of_sa = 0 THEN
				clipped_shape := intersected_geometry;
			ELSE
				clipped_shape := (SELECT st_intersection(clipped_shape,intersected_geometry));
			END IF;
			--increment counter
			number_of_sa := number_of_sa + 1;


		--End of NULL check on study area geometry
		END IF;

	--get next study area geometry
	END LOOP;

	-- transform the shape back into it's original spatial reference
	IF (overlaps_shoreline = TRUE) THEN
		clipped_shape := st_transform(clipped_shape, shape_srid);
	END IF;
	
	--RAISE EXCEPTION '"status":"false","message":"shape overlaps an estuary",%', b_overlaps;
	RETURN;


  END;$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION gwst_clip_shape_to_shoreline(text, integer) OWNER TO postgres;
