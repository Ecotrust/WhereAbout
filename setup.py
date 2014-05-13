from distutils.core import setup
import py2exe
import os, sys

#Build tree of files given a dir (for appending to py2exe data_files)
def add_path_tree( base_path, source_path, target_path, skip_dirs=[ '.svn', '.git'  ]):
    path = os.path.join( base_path, source_path )
    partial_data_files = []
    for root, dirs, files in os.walk( os.path.join( path )):
      sample_list = []
      for skip_dir in skip_dirs:
        if skip_dir in dirs:
          dirs.remove( skip_dir )
      if files:
        for filename in files:
          sample_list.append( os.path.join( root, filename ))
      if sample_list:
        partial_data_files.append((
          root.replace(
            path if path else '',
            target_path if target_path else '',
            1
          ),
          sample_list
        ))
    return partial_data_files

	
################################################################

class InnoScript:
    def __init__(self,
                 name,
                 lib_dir,
                 dist_dir,
                 windows_exe_files = [],
                 lib_files = [],
                 version = "0.0.3"):
        self.lib_dir = lib_dir
        self.dist_dir = dist_dir
        if not self.dist_dir[-1] in "\\/":
            self.dist_dir += "\\"
        self.name = name
        self.version = version
        self.windows_exe_files = [self.chop(p) for p in windows_exe_files]
        self.lib_files = [self.chop(p) for p in lib_files]

    def chop(self, pathname):
        assert pathname.startswith(self.dist_dir)
        return pathname[len(self.dist_dir):]
    
    def create(self, pathname="dist\\DesktopGWST.iss"):
        curr_dir = os.path.abspath(os.path.dirname(sys.argv[0]))
        self.pathname = pathname
        ofi = self.file = open(pathname, "w")
        print >> ofi, "; WARNING: This script has been created by py2exe. Changes to this script"
        print >> ofi, "; will be overwritten the next time py2exe is run!"
        print >> ofi, r"[Setup]"
        print >> ofi, r"AppName=%s %s" % (self.name, self.version)
        print >> ofi, r"AppVerName=%s %s" % (self.name, self.version)
        print >> ofi, r"DefaultDirName={pf}\%s" % self.name
        print >> ofi, r"DefaultGroupName=%s" % self.name
        print >> ofi, r"VersionInfoVersion=%s" % self.version
        print >> ofi, r"VersionInfoCompany=Ecotrust"
        print >> ofi, r"VersionInfoDescription=CA North Coast Commercial And Charter Monitoring 2014 v%s" % self.version
        print >> ofi, r"VersionInfoCopyright=Ecotrust"
        print >> ofi, r"AppCopyright=Ecotrust"
        print >> ofi, r"InfoAfterFile=" + curr_dir + "\desktop-packaging\README.TXT"
        print >> ofi, r"LicenseFile=" + curr_dir + "\desktop-packaging\LICENSE.TXT"
        print >> ofi, r"WizardImageBackColor=clBlack"
        print >> ofi, r"WizardImageFile=" + curr_dir + "\desktop-packaging\Images\OCEAN_VERT_INNO.bmp"
        print >> ofi, r"WizardSmallImageFile=" + curr_dir + "\desktop-packaging\Images\OCEAN_SMALL_INNO.bmp"
        print >> ofi, r"SetupIconFile=" + curr_dir + "\desktop-packaging\Images\OCEAN_SMALL_INNO.ico"
        print >> ofi

        print >> ofi, r"[Dirs]"
        print >> ofi, r'Name: "{app}\"; Permissions: everyone-modify'
        print >> ofi
        
        print >> ofi, r"[Files]"
        for path in self.windows_exe_files + self.lib_files:
            if path == "database\db.sqlite":
                print >> ofi, r'Source: "%s"; DestDir: "{app}\%s"; Flags: ignoreversion; Permissions: everyone-modify' % (path, os.path.dirname(path))
            else:
                print >> ofi, r'Source: "%s"; DestDir: "{app}\%s"; Flags: ignoreversion' % (path, os.path.dirname(path))
        
        #Additional libraries that may not be used but which the pre-build QGIS binary will look for and error if it can't find
        #print >> ofi, r'Source: lib\libgdal-1.dll; DestDir: {app}\lib; Flags: ignoreversion'
        #print >> ofi, r'Source: lib\libgrass_dbmibase.6.3.0.dll; DestDir: {app}\lib; Flags: ignoreversion'
        #print >> ofi, r'Source: lib\libgrass_dgl.6.3.0.dll; DestDir: {app}\lib; Flags: ignoreversion'
        #print >> ofi, r'Source: lib\libgrass_rtree.6.3.0.dll; DestDir: {app}\lib; Flags: ignoreversion'
        #print >> ofi, r'Source: lib\QtSvg4.dll; DestDir: {app}\lib; Flags: ignoreversion'
        #print >> ofi, r'Source: lib\libproj.dll; DestDir: {app}\lib; Flags: ignoreversion'

        print >> ofi, r"[Icons]"
        #print >> ofi, r'WorkingDir: {app}'                  
        #for path in self.windows_exe_files:
        #    print >> ofi, r'Name: "{group}\%s"; Filename: "{app}\%s"; WorkingDir: {app}' % \
        #          (self.name, path)       
        print >> ofi, 'Name: "{group}\%s"; Filename: "{app}\\run-desktop.bat"' % self.name		
        print >> ofi, 'Name: "{group}\User Guide"; Filename: "{app}\media\README.doc"'		
        print >> ofi, 'Name: "{group}\Uninstall %s"; Filename: "{uninstallexe}"' % self.name

    def compile(self):
        try:
            import ctypes2
        except ImportError:
            try:
                import win32api
            except ImportError:
                import os
                os.startfile(self.pathname)
            else:
                print "Ok, using win32api."
                win32api.ShellExecute(0, "compile",
                                                self.pathname,
                                                None,
                                                None,
                                                0)
        else:
            print "Cool, you have ctypes installed."
            res = ctypes.windll.shell32.ShellExecuteA(0, "compile",
                                                      self.pathname,
                                                      None,
                                                      None,
                                                      0)
            if res < 32:
                raise RuntimeError, "ShellExecute failed, error %d" % res
				
				

################################################################

from py2exe.build_exe import py2exe

class build_installer(py2exe):
    # This class first builds the exe file(s), then creates a Windows installer.
    # You need InnoSetup for it.
    def run(self):
        # First, let py2exe do it's work.
        py2exe.run(self)
		
        lib_dir = self.lib_dir
        dist_dir = self.dist_dir
        
        # create the Installer, using the files py2exe has created.
        script = InnoScript("NCAC 2014 Commercial Charter",
                            lib_dir,
                            dist_dir,
                            self.console_exe_files,
                            self.lib_files)
        #print "*** creating the inno setup script***"
        script.create()
        #print "*** compiling the inno setup script***"
        script.compile()
        # Note: By default the final setup.exe will be in an Output subdirectory.

		
######################## py2exe setup options #######################################

django_admin_path = None

# look for django install in python path
for django_path in os.environ[ 'PYTHONPATH' ].split( ';' ):
    # does lib/site-packages/django exist?
    if os.path.exists( os.path.normpath( django_path + '/lib/site-packages/django/' )):
        django_admin_static_path = os.path.normpath( django_path + '/lib/site-packages/django/contrib/admin/static/' )
        django_admin_path = os.path.normpath( django_path + '/lib/site-packages/django/contrib/admin/' )
        django_gis_path = os.path.normpath( django_path + '/lib/site-packages/django/contrib/gis/' )
        break
        
    # does django/contrib directory exist?
    if os.path.exists( os.path.normpath( django_path + '/django/contrib/' )):
        django_admin_static_path = os.path.normpath( django_path + '/django/contrib/admin/static/' )
        django_admin_path = os.path.normpath( django_path + '/django/contrib/admin/' )
        django_gis_path = os.path.normpath( django_path + '/django/contrib/gis/' )
        break

    # does contrib directory exist?
    if os.path.exists( os.path.normpath( django_path + '/contrib/' )):
        django_admin_static_path = os.path.normpath( django_path + '/contrib/admin/static/' )
        django_admin_path = os.path.normpath( django_path + '/contrib/admin/' )
        django_gis_path = os.path.normpath( django_path + '/contrib/gis/' )
        break
        
if django_admin_path:

    #New Django has moved the media files into admin/static/admin. If old Django, ignore.
    if not django_admin_static_path:
        django_admin_static_path = django_admin_path
    
    py2exe_data_files = [(".",["run-desktop.bat","path_test.bat"])]

    py2exe_data_files += add_path_tree( django_admin_path, 'templates', 'templates' )
    py2exe_data_files += add_path_tree( django_admin_path, 'media', 'admin-media' )
    py2exe_data_files += add_path_tree( django_gis_path, 'templates', 'templates' )

    py2exe_data_files += add_path_tree( '', 'database', 'database' )
    py2exe_data_files += add_path_tree( '', 'media', 'media' )
    py2exe_data_files += add_path_tree( '', 'lib', 'lib' )
    py2exe_data_files += add_path_tree( '', 'gwst_app/templates', 'gwst_app/templates' )
    py2exe_data_files += add_path_tree( '', 'registration_custom/templates', 'registration_custom/templates' )
    py2exe_data_files += add_path_tree( '', 'admin_utils/templates', 'admin_utils/templates' )
    py2exe_data_files += add_path_tree( '', 'tiles', 'tiles' )
    py2exe_data_files += add_path_tree( '', 'gdal_data', 'gdal_data' )

    setup(
        options = {"py2exe": {"compressed": False,
                              "optimize": 2,
                              "ascii": 1,
                              "bundle_files": 3,
                              "packages":["encodings","django","gwst_app","simplejson","registration","django_extjs"],
                               "excludes" : ["pywin", "pywin.debugger", "pywin.debugger.dbgcon","pywin.dialogs",
                                           "pywin.dialogs.list","Tkconstants","Tkinter","tcl"],

                                }},
        data_files = py2exe_data_files,
        zipfile = r"lib\shardlib",
        console=[{"script": "gwst.py", "icon_resources": [(1, "desktop-packaging\Images\OCEAN_SMALL_INNO.ico")]}],
        cmdclass = {"py2exe": build_installer},
        )
        
else:
    print "ERROR: cannot find django install in PYTHONPATH -- " + os.environ['PYTHONPATH']