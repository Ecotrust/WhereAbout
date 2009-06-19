-- Function: gwst_validate_shape(text)

-- DROP FUNCTION gwst_validate_shape(text);

CREATE OR REPLACE FUNCTION gwst_validate_shape(shape_geometry_text text)
  RETURNS text AS
$BODY$
  DECLARE
  
    rec record;  
    rec2 record;  
    sa_srid integer;  -- study area srid
    shape_srid integer;  -- the shape's srid
    shape_geometry geometry;  --shape geometry as geometry object
    shape_geometry_clipped geometry;    
    result_text text;  --the text to output from the function call
    GOOGLE_SPATIAL_REF integer := 900913;
    
  BEGIN

  -- Get the srid of the shape geometry
  -- Transform the input geometry from text to geometry object
  shape_srid := (SELECT DISTINCT srid FROM geometry_columns WHERE f_table_name = 'gwst_usershape');
  shape_geometry := (select ST_GeomFromText(shape_geometry_text, GOOGLE_SPATIAL_REF));
  shape_geometry = st_transform(shape_geometry, shape_srid);

  --Check that geometry is valid
  IF (isvalid(shape_geometry)) THEN

	--Clip the shape to the shoreline
	rec :=  gwst_clip_shape_to_shoreline(shape_geometry_text,GOOGLE_SPATIAL_REF);
	
	IF (rec.overlaps_shoreline = TRUE) THEN
		--save clipped shape geometry
		shape_geometry_clipped := rec.clipped_shape;

        --return only the largest of the clipped polyons
        shape_geometry_clipped := gwst_largest_poly_in_multipoly(shape_geometry_clipped);

        RETURN '{"status_code":"0","message":"Shape clipped to shoreline.","clipped_mpa_geom":"' || astext(shape_geometry_clipped) || '","original_geom":"' || shape_geometry_text || '"}';

	ELSE
		--Shape did not intersect shoreline
        shape_geometry_clipped := st_transform(shape_geometry, GOOGLE_SPATIAL_REF);
        
		RETURN '{"status_code":"0","message":"Shape clipped to shoreline.","clipped_mpa_geom":"' || astext(shape_geometry_clipped) || '","original_geom":"' || shape_geometry_text || '"}';
	END IF;

      
  ELSE
    --User is trying to insert an invlaid geometry
    RETURN '{"status_code":"3","message":"New Geometry is NOT valid"}';
  
  END IF;

  END;$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION gwst_validate_shape(text) OWNER TO postgres;
