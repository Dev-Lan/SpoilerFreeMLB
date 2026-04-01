export interface TeamColorPair {
  primary: string
  secondary: string
}

// Primary and secondary colors for each MLB team, keyed by team ID
export const teamColors: Record<number, TeamColorPair> = {
  109: { primary: '#A71930', secondary: '#E3D4AD' }, // Arizona Diamondbacks
  144: { primary: '#CE1141', secondary: '#13274F' }, // Atlanta Braves
  110: { primary: '#DF4601', secondary: '#27251F' }, // Baltimore Orioles
  111: { primary: '#BD3039', secondary: '#0C2340' }, // Boston Red Sox
  112: { primary: '#0E3386', secondary: '#CC3433' }, // Chicago Cubs
  145: { primary: '#27251F', secondary: '#C4CED4' }, // Chicago White Sox
  113: { primary: '#C6011F', secondary: '#000000' }, // Cincinnati Reds
  114: { primary: '#00385D', secondary: '#E31937' }, // Cleveland Guardians
  115: { primary: '#333366', secondary: '#C4CED4' }, // Colorado Rockies
  116: { primary: '#0C2340', secondary: '#FA4616' }, // Detroit Tigers
  117: { primary: '#002D62', secondary: '#EB6E1F' }, // Houston Astros
  118: { primary: '#004687', secondary: '#BD9B60' }, // Kansas City Royals
  108: { primary: '#BA0021', secondary: '#003263' }, // Los Angeles Angels
  119: { primary: '#005A9C', secondary: '#EF3E42' }, // Los Angeles Dodgers
  146: { primary: '#00A3E0', secondary: '#EF3340' }, // Miami Marlins
  158: { primary: '#12284B', secondary: '#FFC52F' }, // Milwaukee Brewers
  142: { primary: '#002B5C', secondary: '#D31145' }, // Minnesota Twins
  121: { primary: '#002D72', secondary: '#FF5910' }, // New York Mets
  147: { primary: '#003087', secondary: '#C4CED4' }, // New York Yankees
  133: { primary: '#003831', secondary: '#EFB21E' }, // Oakland Athletics
  143: { primary: '#E81828', secondary: '#002D72' }, // Philadelphia Phillies
  134: { primary: '#27251F', secondary: '#FDB827' }, // Pittsburgh Pirates
  135: { primary: '#2F241D', secondary: '#FFC425' }, // San Diego Padres
  137: { primary: '#FD5A1E', secondary: '#27251F' }, // San Francisco Giants
  136: { primary: '#0C2C56', secondary: '#005C5C' }, // Seattle Mariners
  138: { primary: '#C41E3A', secondary: '#0C2340' }, // St. Louis Cardinals
  139: { primary: '#092C5C', secondary: '#8FBCE6' }, // Tampa Bay Rays
  140: { primary: '#003278', secondary: '#C0111F' }, // Texas Rangers
  141: { primary: '#134A8E', secondary: '#1D2D5C' }, // Toronto Blue Jays
  120: { primary: '#AB0003', secondary: '#14225A' }, // Washington Nationals
}
