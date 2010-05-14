def autodiscover():
    """
    Auto-discover INSTALLED_APPS admin.py modules and fail silently when
    not present. This forces an import on them to register any admin bits they
    may want.
    """
    
    import imp

    def module_has_submodule(mod, submod_name):
        try:
            imp.find_module(submod_name, mod.__path__)
            return True
        except ImportError:
            return False

    import copy
    from django.conf import settings
    from django.utils.importlib import import_module
    from django.contrib.admin.sites import site

    for app in settings.INSTALLED_APPS:
        mod = import_module(app)
        # Attempt to import the app's admin module.
        try:
            before_import_registry = copy.copy(site._registry)
            import_module('%s.admin' % app)
        except:
            # Reset the model registry to the state before the last import as
            # this import will have to reoccur on the next request and this
            # could raise NotRegistered and AlreadyRegistered exceptions
            # (see #8245).
            site._registry = before_import_registry

            # Decide whether to bubble up this error. If the app just
            # doesn't have an admin module, we can ignore the error
            # attempting to import it, otherwise we want it to bubble up.           
            if module_has_submodule(mod, 'admin'):
                raise
                

from django.db.models.options import Options
from django_extensions.db.fields import UUIDField
                
def new_prepare(self, model):
    if self.order_with_respect_to:
        self.order_with_respect_to = self.get_field(self.order_with_respect_to)
        self.ordering = ('_order',)
        model.add_to_class('_order', OrderWrt())
    else:
        self.order_with_respect_to = None

    if self.pk is None:
        if self.parents:
            # Promote the first parent link in lieu of adding yet another
            # field.
            field = self.parents.value_for_index(0)
            field.primary_key = True
            self.setup_pk(field)
        else:
            auto = UUIDField(verbose_name='ID', primary_key=True,
                    auto_created=True)
            model.add_to_class('id', auto)

    # Determine any sets of fields that are pointing to the same targets
    # (e.g. two ForeignKeys to the same remote model). The query
    # construction code needs to know this. At the end of this,
    # self.duplicate_targets will map each duplicate field column to the
    # columns it duplicates.
    collections = {}
    for column, target in self.duplicate_targets.iteritems():
        try:
            collections[target].add(column)
        except KeyError:
            collections[target] = set([column])
    self.duplicate_targets = {}
    for elt in collections.itervalues():
        if len(elt) == 1:
            continue
        for column in elt:
            self.duplicate_targets[column] = elt.difference(set([column]))

Options._prepare = new_prepare
