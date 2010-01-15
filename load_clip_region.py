#Used to load a shapefile into the database as a clip region
#Requires django environement ot be setup.  Easiest to run from a django shell
#>python manage.py shell
#>import load_clip_region
#>load_clip_region.run()

from django.db.models.loading import get_models
loaded_models = get_models()

import os
from django.contrib.gis.utils.layermapping import LayerMapping
from gwst_app.models import ClipRegion

mapping = {
    'name' : 'name',
    'geom' : 'MULTIPOLYGON',
}

def run(verbose=True) :
    shp = os.path.abspath(os.path.join(os.path.dirname(__file__), 'database/data/OregonRecClipRegion.shp'))
    lm = LayerMapping(
        ClipRegion, 
        shp, 
        mapping,
        transform=False, 
        encoding='iso-8859-1'
    )
    lm.save(strict=True, verbose=verbose)
