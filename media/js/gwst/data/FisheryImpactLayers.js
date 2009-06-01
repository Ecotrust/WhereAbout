Ext.namespace('gwst', 'gwst.data');

gwst.data.FisheryImpactMapUserGroups = [
    [ 'cpfv', 'Comm. Passenger Fishing Vessel' ],
    [ 'com', 'Commercial' ],
    [ 'div', 'Recreational Dive'],
    [ 'kyk', 'Recreational Kayak'],
    [ 'pvt', 'Recreational Vessel'],
    [ 'cnty', 'Recreational All Sectors']
    //[ 'prs', 'Recreational Pier/Shore']
];

/*gwst.data.FisheryImpactMapFishAllSpecies = [
    [ 'abl', 'Abalone' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'clms', 'Clams' ],
    [ 'crkr', 'Croaker' ],
    [ 'dor', 'Dorado (Mahi Mahi)' ],
    [ 'hsqd', 'Humboldt Squid' ],
    [ 'jsmlt', 'Jacksmelt' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'mshrk', 'Mako Shark' ],
    [ 'msqd', 'Market Squid' ],
    [ 'mar', 'Marlin (Swordfish)' ],
    [ 'msls', 'Mussels' ],
    [ 'rask', 'Rays/Skates' ],
    [ 'rcrb', 'Rock Crab' ],
    [ 'rckf', 'Rockfish/Lingcod' ],
    [ 'sal', 'Salmon' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'sndcrb', 'Sand Crab' ],
    [ 'scps', 'Scallops' ],
    [ 'shrk', 'Sharks (other)' ],
    [ 'sprch', 'Surfperch' ],
    [ 'tshrk', 'Thresher Shark' ],
    [ 'tun', 'Tuna' ],
    [ 'urch', 'Urchin' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'whtf', 'Whitefish' ],
    [ 'ytail', 'Yellowtail' ]
];*/

gwst.data.FisheryImpactMapCpfvPorts = [
    [ 'al', 'Entire Study Region' ],
    [ 'sb', 'Santa Barbara' ],
    [ 'ph', 'Port Hueneme/Channel Islands Harbor' ],
    [ 'sm', 'Santa Monica' ],
    [ 'sp', 'San Pedro/Long Beach' ],
    [ 'nb', 'Newport Beach' ],
    [ 'dp', 'Dana Point' ],
    [ 'oc', 'Oceanside' ],
    [ 'sd', 'San Diego' ]
];

gwst.data.FisheryImpactMapRecPorts = [
    [ 'cmp', 'Entire Study Region' ],
    [ 'sbk', 'Santa Barbara County' ],
    [ 'vtk', 'Ventura County' ],
    [ 'lak', 'Los Angeles County' ],
    [ 'ock', 'Orange County' ],
    [ 'sdk', 'San Diego County' ]
];

gwst.data.FisheryImpactMapPvtPorts = [
    [ 'cmp', 'Entire Study Region' ],
    [ 'sbk', 'Santa Barbara County' ],
    [ 'vtk', 'Ventura County' ],
    [ 'lak', 'Los Angeles County' ],
    [ 'ock', 'Orange County' ],
    [ 'osk', 'Oceanside' ],
    [ 'sdk', 'San Diego County' ]
];

gwst.data.FisheryImpactMapComPorts = [
    [ 'allk', 'Entire study region' ],
    [ 'sbk', 'Santa Barbara' ],
    [ 'vtk', 'Ventura' ],
    [ 'phk', 'Port Hueneme/Channel Islands Harbor' ],
    [ 'spk', 'San Pedro' ],
    [ 'dpk', 'Dana Point' ],
    [ 'ock', 'Oceanside' ],
    [ 'sdk', 'San Diego' ] 
];

gwst.data.FisheryImpactMapCntyPorts = [
    [ 'sb', 'Santa Barbara County' ],
    [ 'vt', 'Ventura County' ],
    [ 'la', 'Los Angeles County' ],
    [ 'oc', 'Orange County' ],
    [ 'sd', 'San Diego County' ]
];


// data organized by group, then port, then species

gwst.data.FisheryImpactMapAllCntySpecies = [
    [ 'comp', 'Target Species Aggregated' ]
];

gwst.data.FisheryImpactMapAllCpfvSpecies = [
    [ 'comp', 'All Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'sclp', 'California Scorpionfish (Sculpin)' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'ling', 'Lingcod' ],
    [ 'rock', 'Rockfish' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'whtf', 'Whitefish' ]
];

gwst.data.FisheryImpactMapAllCpfvSpeciesSansComp = [
    [ 'barc', 'Barracuda' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'sclp', 'California Scorpionfish (Sculpin)' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'ling', 'Lingcod' ],
    [ 'rock', 'Rockfish' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'whtf', 'Whitefish' ]
];

gwst.data.FisheryImpactMapStudyRegionComSpecies = [
    [ 'chalh', 'California Halibut - hook and line' ],
    [ 'cpss', 'Coastal Pelagics - seine' ],
    [ 'lbt', 'Live Bait' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'nsrkh', 'Nearshore Fishery - hook and line' ],
    [ 'pbns', 'Pacific Bonito - seine' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'salt', 'Salmon - troll' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'sqdb', 'Squid - braile' ],
    [ 'sqds', 'Squid - seine' ],
    [ 'swdh', 'Swordfish - harpoon' ],
    [ 'urcd', 'Urchin - dive' ],
    [ 'wsbg', 'White Seabass - gilnet' ]
];

gwst.data.FisheryImpactMapSbkComSpecies = [
    [ 'chalh', 'California Halibut - hook and line' ],
    [ 'chalt', 'California Halibut - trawl' ],
    [ 'dnsrh', 'Deep Nearshore Rockfish - hook and line' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'nsrkh', 'Nearshore Fishery - hook and line' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'salt', 'Salmon - troll' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'scuct', 'Sea Cucumber - trawl' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'urcd', 'Urchin - dive' ],
    [ 'wsbg', 'White Seabass - gilnet' ]
];

gwst.data.FisheryImpactMapVtkComSpecies = [
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'sqds', 'Squid - seine' ]
];

gwst.data.FisheryImpactMapPhkComSpecies = [
    [ 'chalh', 'California Halibut - hook and line' ],
    [ 'cpss', 'Coastal Pelagics - seine' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'nsrkh', 'Nearshore Fishery - hook and line' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'sqds', 'Squid - seine' ],
    [ 'urcd', 'Urchin - dive' ]
];

gwst.data.FisheryImpactMapSpkComSpecies = [
    [ 'cpss', 'Coastal Pelagics - seine' ],
    [ 'lbt', 'Live Bait' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'nsrkh', 'Nearshore Fishery - hook and line' ],
    [ 'pbns', 'Pacific Bonito - seine' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'sqdb', 'Squid - braile' ],
    [ 'sqds', 'Squid - seine' ],
    [ 'swdh', 'Swordfish - harpoon' ],
    [ 'urcd', 'Urchin - dive' ],
    [ 'wsbg', 'White Seabass - gilnet' ]
];

gwst.data.FisheryImpactMapDpkComSpecies = [
    [ 'lbt', 'Live Bait' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'urcd', 'Urchin - dive' ]
];

gwst.data.FisheryImpactMapOckComSpecies = [
    [ 'lbt', 'Live Bait' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'urcd', 'Urchin - dive' ]
];

gwst.data.FisheryImpactMapSdkComSpecies = [
    [ 'lbt', 'Live Bait' ],
    [ 'lobt', 'Lobster - trap' ],
    [ 'nsrkt', 'Nearshore Fishery - trap' ],
    [ 'nsrkh', 'Nearshore Fishery - hook and line' ],
    [ 'rcrbt', 'Rock Crab - trap' ],
    [ 'sccd', 'Sea Cucumber - dive' ],
    [ 'spwnt', 'Spot Prawn - trap' ],
    [ 'urcd', 'Urchin - dive' ]
];

gwst.data.FisheryImpactMapAllDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'crkr', 'Croaker' ],
    //[ 'dor', 'Dorado (Mahi Mahi)' ],
    [ 'lobs', 'Lobster' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'scalp', 'Scallops' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapCmpDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'chal', 'California Halibut' ],
    [ 'lobs', 'Lobster' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];


gwst.data.FisheryImpactMapSbkDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'crkr', 'Croaker' ],
    //[ 'dor', 'Dorado (Mahi Mahi)' ],
    [ 'lobs', 'Lobster' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    //[ 'scalp', 'Scallops' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapVtkDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    //[ 'barc', 'Barracuda' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    //[ 'snbas', 'Sand Bass' ],
    [ 'scalp', 'Scallops' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapLakDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    //[ 'barc', 'Barracuda' ],
    //[ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    //[ 'crkr', 'Croaker' ],
    //[ 'dor', 'Dorado (Mahi Mahi)' ],
    [ 'lobs', 'Lobster' ],
    //[ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'scalp', 'Scallops' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapOckDivSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    //[ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'crkr', 'Croaker' ],
    //[ 'dor', 'Dorado (Mahi Mahi)' ],
    [ 'lobs', 'Lobster' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'scalp', 'Scallops' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapAllKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'rcrb', 'Rock Crab' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'sqd', 'Squid' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapCmpKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapLakKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    //[ 'mckl', 'Mackerels' ],
    //[ 'rcrb', 'Rock Crab' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    //[ 'sqd', 'Squid' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapOckKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    //[ 'sqd', 'Squid' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapSbkKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ]
    //[ 'lobs', 'Lobster' ],
    //[ 'snbas', 'Sand Bass' ],
    //[ 'tshk', 'Thresher Shark' ]
];

gwst.data.FisheryImpactMapVtkKykSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    //[ 'barc', 'Barracuda' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    //[ 'rcrb', 'Rock Crab' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    //[ 'sqd', 'Squid' ],
    //[ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ]
    //[ 'ytail', 'Yellowtail' ]
];


gwst.data.FisheryImpactMapAllPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    [ 'crkr', 'Croaker' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'srfp', 'Surfperch' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapCmpPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'wsbas', 'White Seabass' ]
];

gwst.data.FisheryImpactMapLakPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    [ 'shphd', 'California Sheephead' ],
    //[ 'crkr', 'Croaker' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    //[ 'srfp', 'Surfperch' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapOckPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    [ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'shphd', 'California Sheephead' ],
    [ 'crkr', 'Croaker' ],
    [ 'lobs', 'Lobster' ],
    [ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    //[ 'srfp', 'Surfperch' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapOskPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    //[ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'shphd', 'California Sheephead' ],
    [ 'lobs', 'Lobster' ],
    //[ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    [ 'snbas', 'Sand Bass' ],
    [ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapSbkPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    //[ 'barc', 'Barracuda' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'lobs', 'Lobster' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    //[ 'snbas', 'Sand Bass' ],
    //[ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ]
    //[ 'ytail', 'Yellowtail' ]
];

gwst.data.FisheryImpactMapVtkPvtSpecies = [
    [ 'comp', 'Target Species Aggregated' ],
    [ 'barc', 'Barracuda' ],
    //[ 'bon', 'Bonita' ],
    [ 'clbas', 'Calico Bass' ],
    [ 'chal', 'California Halibut' ],
    //[ 'crkr', 'Croaker' ],
    //[ 'lobs', 'Lobster' ],
    //[ 'mckl', 'Mackerels' ],
    [ 'rckf', 'Rockfish / Lingcod' ],
    //[ 'tshk', 'Thresher Shark' ],
    [ 'wsbas', 'White Seabass' ],
    [ 'ytail', 'Yellowtail' ]
];



gwst.data.FisheryImpactMapSpeciesByGroup = [
    [ 'cpfv', [[ 'al', gwst.data.FisheryImpactMapAllCpfvSpeciesSansComp ],
	       [ 'sb', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'ph', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'sm', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'sp', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'nb', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'dp', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'oc', gwst.data.FisheryImpactMapAllCpfvSpecies ],
	       [ 'sd', gwst.data.FisheryImpactMapAllCpfvSpecies ]
	       ]],
    [ 'com',  [
                [ 'allk', gwst.data.FisheryImpactMapStudyRegionComSpecies ],
                [ 'sbk', gwst.data.FisheryImpactMapSbkComSpecies ],
                [ 'vtk', gwst.data.FisheryImpactMapVtkComSpecies ],
                [ 'phk', gwst.data.FisheryImpactMapPhkComSpecies ],
                [ 'spk', gwst.data.FisheryImpactMapSpkComSpecies ],
                [ 'dpk', gwst.data.FisheryImpactMapDpkComSpecies ],
                [ 'ock', gwst.data.FisheryImpactMapOckComSpecies ],
                [ 'sdk', gwst.data.FisheryImpactMapSdkComSpecies ] 
              ]],
    [ 'div', [[ 'cmp', gwst.data.FisheryImpactMapCmpDivSpecies ],
	      [ 'sbk', gwst.data.FisheryImpactMapSbkDivSpecies ],
	      [ 'vtk', gwst.data.FisheryImpactMapVtkDivSpecies ],
	      [ 'lak', gwst.data.FisheryImpactMapLakDivSpecies ],
	      [ 'ock', gwst.data.FisheryImpactMapOckDivSpecies ],
	      [ 'sdk', gwst.data.FisheryImpactMapAllDivSpecies ]
	      ]],
    [ 'kyk', [[ 'cmp', gwst.data.FisheryImpactMapCmpKykSpecies ],
	      [ 'sbk', gwst.data.FisheryImpactMapSbkKykSpecies ],
	      [ 'vtk', gwst.data.FisheryImpactMapVtkKykSpecies ],
	      [ 'lak', gwst.data.FisheryImpactMapLakKykSpecies ],
	      [ 'ock', gwst.data.FisheryImpactMapOckKykSpecies ],
	      [ 'sdk', gwst.data.FisheryImpactMapAllKykSpecies ]
	      ]],
    [ 'pvt', [[ 'cmp', gwst.data.FisheryImpactMapCmpPvtSpecies ],
	      [ 'sbk', gwst.data.FisheryImpactMapSbkPvtSpecies ],
	      [ 'vtk', gwst.data.FisheryImpactMapVtkPvtSpecies ],
	      [ 'lak', gwst.data.FisheryImpactMapLakPvtSpecies ],
	      [ 'ock', gwst.data.FisheryImpactMapOckPvtSpecies ],
	      [ 'osk', gwst.data.FisheryImpactMapOskPvtSpecies ],
	      [ 'sdk', gwst.data.FisheryImpactMapAllPvtSpecies ]
	      ]],
    [ 'cnty', [[ 'all', gwst.data.FisheryImpactMapAllCntySpecies ]
	      ]]
];

gwst.data.FisheryImpactMapPortsByGroup = [
    [ 'cpfv', gwst.data.FisheryImpactMapCpfvPorts ],
    [ 'com',  gwst.data.FisheryImpactMapComPorts ],
    [ 'div', gwst.data.FisheryImpactMapRecPorts ],
    [ 'kyk', gwst.data.FisheryImpactMapRecPorts ],
    [ 'pvt', gwst.data.FisheryImpactMapPvtPorts ],
    [ 'cnty', gwst.data.FisheryImpactMapCntyPorts ]
];