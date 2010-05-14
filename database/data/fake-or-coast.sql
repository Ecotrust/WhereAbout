.loadshp database/data/fake-or-coast foo CP1252 3310
insert into gwst_region_clip (id, name, geom)
select "a1", name, Geometry from foo;