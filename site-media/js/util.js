function capFirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capWords(str){
   words = str.split(" "); 
   for (i=0 ; i < words.length ; i++){
      testwd = words[i];
      firLet = testwd.substr(0,1); //lop off first letter
      rest = testwd.substr(1, testwd.length -1)
      words[i] = firLet.toUpperCase() + rest   
   }         
   return words.join(" ");
}