.loadshp database/data/fake-or-coast foo CP1252 3310
insert into gwst_region_clip (name, geom)
select name, Geometry from foo;