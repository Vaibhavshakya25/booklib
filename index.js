const search = document.querySelector('#search');
const btn = document.querySelector('#btn');
const datatable = document.querySelector('.data-table');
const previous = document.getElementById('left-btn');
const next = document.getElementById('right-btn');
const inputdiv = document.querySelector('#search-books');
const javascript = document.getElementById('javascript');
const harrypotter = document.getElementById('harrypotter');
const indianhistory = document.getElementById('indianhistory');
const crypto = document.getElementById('crypto');
const criminallaw = document.getElementById('criminallaw');
const topcontainer = document.querySelector('.top-container');
let index = 0;
let alldata ;
async function fetchauthor(title){
    try{
        await  fetch(`https://openlibrary.org/search.json?author=${title}&sort=new`)
         .then(response => response.json())
         .then((response) =>{
             alldata = response;
             index = 0;
             topcontainer.innerHTML = "";
             let heading = document.createElement('h3');
             heading.style.fontSize = "2rem";
             heading.style.marginLeft = "2rem";
             heading.innerText = search.value;
             topcontainer.appendChild(heading);
             updateui(response,"next");
         })
     }
     catch(err){
         console.log("Error is occur ->" , err);
     }
}
async function fetchdata(title){
    try{
       await  fetch(`https://openlibrary.org/search.json?title=${title}`)
        .then(response => response.json())
        .then((response) =>{
            if(response.docs.length == 0){
                fetchauthor(title);
            }
            else{
                alldata = response;
                index = 0;
                topcontainer.innerHTML = "";
                let heading = document.createElement('h3');
                heading.style.fontSize = "2rem";
                heading.style.marginLeft = "2rem";
                heading.innerText = title;
                topcontainer.appendChild(heading);
                updateui(response,"next");

            }
        })
    }
    catch(err){
        console.log("Error is occur ->" , err);
    }
}
javascript.addEventListener('click',()=>{
    let subject = "javascript";
    fetchdata(subject);
})

harrypotter.addEventListener('click',()=>{
    let subject = "harry potter";
    fetchdata(subject);
})

indianhistory.addEventListener('click',()=>{
    let subject = "india history";
    fetchdata(subject);
})

criminallaw.addEventListener('click',()=>{
    let subject = "criminal law";
    fetchdata(subject);
})

crypto.addEventListener('click',()=>{
    let subject = "crypto currency";
    fetchdata(subject);
})
btn.addEventListener('click',()=>{
 fetchdata(search.value);
})
const  latestyear = (array)=>{
    let latestyear = 0;
   for(let i = 0;i<array.length;i++){
      if(latestyear<array[i]){
        latestyear = array[i];
      }
   }
   return latestyear;
}
const firstyear = (array)=>{
    let firstyear = 3000;
    for(let i = 0;i<array.length;i++){
        if(firstyear>array[i]){
            firstyear = array[i];
        }
    }
    return firstyear;
}
const updateui = (response,fun)=>{
    if(datatable.contains == true){
        datatable.innerHTML = "";
    }
    let row = datatable.insertRow(0);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
   cell1.innerHTML = "<strong>Title and Sub Title</strong>";
   cell2.innerHTML = "<strong>Author</strong>";
   cell3.innerHTML = "<strong>Latest Publish Year</strong>";
   cell4.innerHTML = "<strong>First Publish Year</strong>";
   if(fun == "next"){
    let currentindex = index;
    let lastindex = index + 10;
    index = index + 10;
    if(index>=response.docs.length){
        next.style.opacity = 0.5;
        index = response.docs.length-10;
    }
    let filtereddata = alldata.docs.filter((value,ind)=> ind>=currentindex && ind<lastindex);
   displaytable(filtereddata);
   }
   else{
    index = index -10;
    if(index<=10){
        previous.style.opacity = 0.5;
        index = 10;
    }
   let previndex = index-10;
   let currentindex = index;
    let filtereddata = alldata.docs.filter((value,ind)=> ind>=previndex && ind<currentindex);
   displaytable(filtereddata);
   }
  
}
inputdiv.addEventListener('keypress',(event)=>{
   if(event.key==='Enter'){
    event.preventDefault();
    btn.click();
   }
   
})

const  displaytable = (filtereddata)=>{
    try{
        for(let i = 0; i<filtereddata.length;i++){
            let r = datatable.insertRow(i+1);
            let c1 = r.insertCell(0);
            let c2 = r.insertCell(1);
            let c3 = r.insertCell(2);
            let c4 = r.insertCell(3);
            datatable.contains = true;
            let subtitle = "";
            if(filtereddata[i].subtitle!=undefined){
               subtitle = filtereddata[i].subtitle;
            }
            c1.innerHTML = filtereddata[i].title +" "+ subtitle;
            c2.innerHTML = filtereddata[i].author_name[0];
            c3.innerHTML = latestyear(filtereddata[i].publish_year);
            c4.innerHTML = firstyear(filtereddata[i].publish_year);
            previous.style.scale = 1;
            next.style.scale = 1;
           }
       }
       catch(err){
          
       }
}

next.addEventListener('click',()=>{
   updateui(alldata,"next");
   if(index>10){
    previous.style.opacity = 1;
}
})

previous.addEventListener('click',()=>{
    if(index < alldata.docs.length){
        next.style.opacity = 1;
      }
  updateui(alldata,"previous");
})