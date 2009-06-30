#===============================================================================
# Delphos - a decision-making tool for community-based marine conservation.
# 
# @copyright    2007 Ecotrust
# @author        Tim Welch
# @contact        twelch at ecotrust dot org
# @license        GNU GPL 2 
# 
# This program is free software; you can redistribute it and/or 
# modify it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.  The full license for this distribution
# has been made available in the file LICENSE.txt
#
# $Id$
#
# @summary - 
#===============================================================================

import csv

class UnicodeReader:
    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        self.reader = csv.reader(f, dialect=dialect, **kwds)
        self.encoding = encoding
    
    def next(self):
        row = self.reader.next()
        return [unicode(s, self.encoding) for s in row]
    
    def __iter__(self):
        return self

class UnicodeWriter:
    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        self.writer = csv.writer(f, dialect=dialect, **kwds)
        self.encoding = encoding
    
    def writerow(self, row):
        self.writer.writerow([s.encode("utf-8") for s in row])
    
    def writerows(self, rows):
        for row in rows:
            self.writerow(row)

if __name__ == "__main__":
    try:
        oldurow = [u'\u65E5\u672C\u8A9E',
        u'Hi Mom -\u263a-!',
        u'A\u2262\u0391.']
        writer = UnicodeWriter(open("uni.csv", "wb"))
        writer.writerow(oldurow)
        del writer
        
        reader = UnicodeReader(open("uni.csv", "rb"))
        newurow = reader.next()
        print "trivial test", newurow == oldurow and "passed" or "failed"
    finally:
        import os
        os.unlink("uni.csv")