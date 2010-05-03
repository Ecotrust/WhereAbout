from distutils.core import setup
import py2exe
import os

#Build tree of files given a dir (for appending to py2exe data_files)
#Taken from http://osdir.com/ml/python.py2exe/2006-02/msg00085.html
def tree(src):
    list = [(root, map(lambda f: os.path.join(root, f), files)) for (root, dirs, files) in os.walk(os.path.normpath(src))]
    new_list = []
    for (root, files) in list:
	#print "%s , %s" % (root,files)
        if len(files) > 0 and root.count('.svn') == 0:
            new_list.append((root, files))
    return new_list 

	
################################################################

class InnoScript:
    def __init__(self,
                 name,
                 lib_dir,
                 dist_dir,
                 windows_exe_files = [],
                 lib_files = [],
                 version = "1.0"):
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
        print >> ofi, r"VersionInfoDescription=Desktop Survey Tool"
        print >> ofi, r"VersionInfoCopyright=Ecotrust"
        print >> ofi, r"AppCopyright=Ecotrust"
        print >> ofi, r"InfoAfterFile=desktop-packaging\README.TXT"
        print >> ofi, r"LicenseFile=desktop-packaging\LICENSE.TXT"
        print >> ofi, r"WizardImageBackColor=clBlack"
        print >> ofi, r"WizardImageFile=desktop-packaging\Images\OCEAN_VERT_INNO.bmp"
        print >> ofi, r"WizardSmallImageFile=desktop-packaging\Images\OCEAN_SMALL_INNO.bmp"
        print >> ofi, r"SetupIconFile=desktop-packaging\Images\OCEAN_SMALL_INNO.ico"
        print >> ofi

        print >> ofi, r"[Files]"
        for path in self.windows_exe_files + self.lib_files:
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
        print >> ofi, 'Name: "{group}\%s"; Filename: "{app}\\run.bat"' % self.name		
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
        #script = InnoScript("Desktop Survey Tool",
        #                    lib_dir,
        #                    dist_dir,
        #                    self.console_exe_files,
        #                    self.lib_files)
        #print "*** creating the inno setup script***"
        #script.create()
        #print "*** compiling the inno setup script***"
        #script.compile()
        # Note: By default the final setup.exe will be in an Output subdirectory.

		
######################## py2exe setup options ########################################
	
data_files = [(".",["run-desktop.bat","path_test.bat"])] +tree('database') + tree('media') + tree('lib') + tree('gwst_app/templates') + tree('registration_custom/templates') + tree('tiles')

setup(
    options = {"py2exe": {"compressed": False,
                          "optimize": 2,
                          "ascii": 1,
                          "bundle_files": 3,
                          "packages":["encodings","django","gwst_app","simplejson"],
                           "excludes" : ["pywin", "pywin.debugger", "pywin.debugger.dbgcon","pywin.dialogs",
                                       "pywin.dialogs.list","Tkconstants","Tkinter","tcl"],

                            }},
    data_files = data_files,
    zipfile = r"lib\shardlib",
	console=[{"script": "gwst.py", "icon_resources": [(1, "desktop-packaging\Images\OCEAN_SMALL_INNO.ico")]}],
	cmdclass = {"py2exe": build_installer},
    )