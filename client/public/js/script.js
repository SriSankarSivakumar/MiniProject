// const { validate } = require("../../../server/models/Admin");
var jwtToken,taskData,userList,alertTaskData,taskDeclinedName="",taskId=0,createdAtDate=[],updatedAtDate=[];
var admincreatedAtDate=[],adminupdatedAtDate=[];
function register(){
    document.getElementById("loginpage").style.display="none";
    let registerform =`
    <section id ="registerpage" >
      <div class="login-outer">
        <div class="login-inner">
          <div style="padding: 2rem; margin-top: 1rem;">
            <h1 class="fa fa-lock" class="title" >&nbsp;Register</h1><hr>
            <form>
            <div style="margin-top: 1.5rem;">
            <label for="empid" class="label">Employee ID</label>
            <i class="fa fa-user" aria-hidden="true"></i>
            <input type="number" name="empid" id="newempid" placeholder="Enter Employee ID" class="input-field" required>
            </div>
            <div style="margin-top: 1.5rem;">
            <label for="name" class="label">Name</label>
            <i class="fa fa-user" aria-hidden="true"></i>
            <input type="name" name="name" id="rname" placeholder="Enter Name" class="input-field" required>
            </div>
              <div style="margin-top: 1.5rem;">
                <label for="email" class="label">Email Address</label>
                <i class="fa fa-envelope"></i>
                <input type="email" name="email" id="remail" class="input-field" placeholder="Enter Email" required><br>
              </div>
              <div style="margin-top: 1.5rem;">
                <label for="password" class="label">Password</label>
                <i class="fa fa-unlock" aria-hidden="true"></i>
                <input type="password" name="password" id="rpassword" placeholder="Password" class="input-field" required>
              </div>
              <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: flex-start;">


                  
                </div>
              
              </div>
              <hr>
              <div style="margin-top: 1.5rem; text-align: right;">
                <button class="button1"><a href="index.html">Cancel</a></button>
                <button type="button" id="finalregisterbutton" class="button2" onclick='registerCredential()'>Register</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
    `
    document.getElementById("registerpage").innerHTML= registerform ;
}
function registerCredential(){
    let newname = document.getElementById("rname").value;
    let newusername = document.getElementById("remail").value;
    let newpassword = document.getElementById("rpassword").value;
    let newempid = document.getElementById("newempid").value;
    if (newempid.trim() == "" || newname.trim() == "" || newusername.trim()==""|| newpassword.trim()==""){
      alert('Please fill all fields');
    }else{
    const http = new XMLHttpRequest();
    http.open("POST", `http://localhost:3000/register`,true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify({
        "empid":newempid,
        "name":newname,
        "username": newusername,
        "password": newpassword
    }));
	http.onreadystatechange = function () {
		if (this.readyState == 4 ){
            if(this.status == 201) {
                const newobj = this.responseText;
                if(newobj==="Registered Successfully"){
                    alert('Registration Successful');
                    document.getElementById("registerpage").style.display="none";
                    document.getElementById("loginpage").style.display="block";
                }
            }else{
              alert('Username already exists!');
              document.getElementById("rname").value="";
              document.getElementById("remail").value="";
              document.getElementById("rpassword").value="";
              document.getElementById("newempid").value="";
            }
	    }
    }
  }
}

function checkAdminCredential(){
    let username = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let adminCred = {
        "username": username,
        "password": password
    }
    if(username.trim()=="" || password.trim()==""){
      alert("Please fill all fields");
    }else{
    const http = new XMLHttpRequest();
    http.open("POST", `http://localhost:3000/adminlogin`,true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify({
        "username": username,
        "password": password
    }));
	http.onreadystatechange = function () {
		if (this.readyState == 4 ){
            if(this.status == 200) {
            const newobj = this.responseText;
            // console.log( newobj);
            // console.log(JSON.parse(newobj).token);
            jwtToken=JSON.parse(newobj).token;
            
            localStorage.setItem("AdminToken",JSON.parse(newobj).token)
            localStorage.setItem("AdminUserName",JSON.parse(newobj).adminName)
            if(JSON.parse(newobj).token){
             adminValidateToken();
            }
           
        }else{
            alert('Invalid Credentials');
            document.getElementById("password").value="";
        }
            
	    }
    }
  }
}
function checkUserCredential(){
  event.preventDefault();
    let username = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let adminCred = {
        "username": username,
        "password": password
    }
    if(username.trim()=="" || password.trim()==""){
      alert("Please fill all fields");
    }else{
    const http = new XMLHttpRequest();
    http.open("POST", `http://localhost:3000/login`,true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify({
        "username": username,
        "password": password
    }));
	http.onreadystatechange = function () {
		if (this.readyState == 4 ){
            if(this.status == 200) {
            const newobj = this.responseText;
            // console.log( newobj);
            // console.log(JSON.parse(newobj).token);
            jwtToken=JSON.parse(newobj).token;
            
            localStorage.setItem("Token",JSON.parse(newobj).token)
            localStorage.setItem("UserName",JSON.parse(newobj).userName)
            if(JSON.parse(newobj).token){
                userValidateToken();
            }
            
        }else{
            alert('Invalid Credentials');
            document.getElementById("password").value="";
        }
            
	    }
    }
  }
}
function adminValidateToken(){
  var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/validateToken`,true);
    xhttp.setRequestHeader("authorisation",jwtToken)
    xhttp.send();
    xhttp.onreadystatechange = function () {
		if (this.readyState == 4 ){
            if(this.status == 200) {
                const newobj= this.responseText;
                if(newobj=="Authorized"){
                  adminTask();
                   console.log("Token Validation Successful");
                }
            }
        
        }
    }
}
function userValidateToken(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/validateToken`,true);
    xhttp.setRequestHeader("authorisation",jwtToken)
    xhttp.send();
    xhttp.onreadystatechange = function () {
		if (this.readyState == 4 ){
            if(this.status == 200) {
                const newobj= this.responseText;
                if(newobj=="Authorized"){
                    userTask();
                   console.log("Token Validation Successful");
                }
            }
        
        }
    }


}
function adminTask(){
  document.getElementById("loginpage").style.display="none";
  localStorage.removeItem("taskDeclinedName");
  let name = localStorage.getItem("AdminUserName");
    // console.log("Name",name);
    if (name === "Anu"){
        const http = new XMLHttpRequest();
        http.open("GET", `http://localhost:3000/task`,true);
        // http.setRequestHeader("Authorization",localStorage.getItem("token"))
        http.setRequestHeader("Content-Type", "application/json");
        http.send();
        http.onreadystatechange = function () {
        	if (this.readyState == 4 ){
                if(this.status == 200) {
                    taskData = JSON.parse(this.responseText);
                    // console.log(taskData);
                   
                    getUsersList();
                    
                }
                
            }
        }
        
    }
}
function userTask(){
    document.getElementById("loginpage").style.display="none";
    // document.getElementById("allTaskUserDisplay").style.display="none";
      // console.log("Userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
      const http = new XMLHttpRequest();
      http.open("GET", `http://localhost:3000/task`,true);
      // http.setRequestHeader("Authorization",localStorage.getItem("token"))
      http.setRequestHeader("Content-Type", "application/json");
      http.send();
      http.onreadystatechange = function () {
        if (this.readyState == 4 ){
              if(this.status == 200) {
                  taskData = JSON.parse(this.responseText);
                  // console.log(taskData);
                  UserTask();
                  
              }
              
          }
      }
    
}
function getUsersList(){
  const http = new XMLHttpRequest();
  http.open("GET", `http://localhost:3000/usersList`,true);
  // http.setRequestHeader("Authorization",localStorage.getItem("token"))
  http.setRequestHeader("Content-Type", "application/json");
  http.send();
  http.onreadystatechange = function () {
    if (this.readyState == 4 ){
      if(this.status == 200) {
          userList = JSON.parse(this.responseText);
        // console.log(userList);
        admintaskDisplay();
      }
          
    }
  }
}
function admintaskDisplay(){

  setInterval(function(){
    console.log("Adminnnn Intervalllll");
    if(localStorage.getItem("taskDeclinedName")){
      console.log("Adminnnn alerttttt",taskDeclinedName);
      // toastr.success("eber<br /><br /><button type="button" class="btn clear">Yes</button>", "Task declined")
      toastr.success(`Task declined<br /><br /><button type='button' class='btn clear' onclick="adminTask();">OK</button>`, `${localStorage.getItem("taskDeclinedName")}`);

    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": 0,
      "extendedTimeOut": 0,
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut",
      "tapToDismiss": false
    }
        }
      },5000)
  
  let assigny_list;
    for(let user in userList){
      assigny_list+=`<option value="${userList[user].name}">${userList[user].name}</option>`
    }
    for(let i in taskData){
      const utcDateTime = taskData[i].createdAt;
      const utcDate = new Date(utcDateTime);
      const istDate = new Date(utcDate.getTime() + 19800000); // Convert UTC timestamp to IST
      const istDateString = istDate.toLocaleDateString();
      const istTimeString = istDate.toLocaleTimeString();
      // const finalcreateddate = istDateString +" "+ istTimeString
      admincreatedAtDate.push(istDateString);

      const updateutcDateTime = taskData[i].updatedAt;
      const updateutcDate = new Date(updateutcDateTime);
      const updateistDate = new Date(updateutcDate.getTime() + 19800000); // Convert UTC timestamp to IST
      const updateistDateString = updateistDate.toLocaleDateString();
      // const istTimeString = istDate.toLocaleTimeString();
      adminupdatedAtDate.push(updateistDateString);
    }
  console.log("Created At data",admincreatedAtDate);
  console.log("Updated At data",adminupdatedAtDate);
    let adminTaskTable = `
    <!DOCTYPE html>
    <html>
        <title>
            Task Tracker
        </title>
        <head>

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
        <link rel="stylesheet" href="./lib/bootstrap.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Didact+Gothic&amp;display=swap" rel="stylesheet">
        <script src="./lib/bootstrap.bundle.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="./css/adminTask.css">
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
       </head>
    
        <header>
            <span style="font-weight:bolder">Search
            <input type="text" name="comments" id="search" placeholder="Search you tasks here..." class="input-field" ></span>
            <p> Hi ${localStorage.getItem("AdminUserName")}, these are the tasks you assigned...</p> 
            <div id="grow">
            </div>
            <div class="drop">
                   <label for="statusfilter">Check Statuses:</label>

                    <select name="statusfilter" id="statusfilter" onclick="displayAdminTaskFilterData(value)">
                    <option value="All">All</option>
                    <option value="Yet to start">Yet to start</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    </select></div>
            <button  onclick="addTaskButton();" id="addTask" type="button"><i class="fa-solid fa fa-plus"></i></button>
            <div class="modal fade show" id="modalAddUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style="display: none;">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-body">
                    <form id="addTaskForm">
                        <input type="text" id="inputTitle" placeholder="Enter Title">
                        <input type="text" id="inputDescription" placeholder="Enter Description">
                        <select id="inputName">
                        <option disabled="" selected="">Assign to</option>
                        ${assigny_list}
                        </select>
                        <select id="inputStatus">
                            <option disabled="" selected="">Status</option>
                            <option value="Yet to start">Yet to start</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>     
                        </select>
                        <button type="button" class="btn btn-primary" id="addUserButton" onclick="addTask()">Add Task</button>
                    </form>
                </div>
              </div>
            </div>
        </div>
            <button id="signoutbtn" onClick="clearAdminLogin();" type="button"><i id="signout" class="fa-solid fa fa-sign-out" ></i></button>

    
            
        </header>
        <body>
        <main>
            <table id="admintable">
                <tr id="tableHeadings">
                    <th class="issuedatehead">Issued At</th>
                    <th class="updatedatehead">Updated At</th>
                    <th class="taskIdhead">Task ID</th>
                    <th class="titlehead">Title</th>
                    <th class="deschead">Description</th>
                    <th class="asshead">Assigned to</th>
                    <th class="commentshead">Comments</th>
                    <th class="dropdownstatushead">Status</th>
                    <th class="edithead"></th>
                </tr>
                <tbody id="adminFilterTaskStatusData"></tbody>
                <tbody id = "diplayAllTaskAssigned">`

    
    for(let obj in taskData){
      adminTaskTable+=`<tr class="user" id="user1">
      <td class="issuedate">${admincreatedAtDate[obj]}</td>
      <td class="updatedate">${adminupdatedAtDate[obj]}</td>
        <td class="taskId">${taskData[obj].taskId}</td>
        <td class="tasktitle">${taskData[obj].title}</td>
        <td class="usertaskdesc">${taskData[obj].description}</td>
        <td class="assto">
        <select class = "assignydropdown" name="assignto" id="assignto${obj}">
        <option disabled ="" selected ="" value="${taskData[obj].assigned_to}">${taskData[obj].assigned_to}</option>
        ${assigny_list}
        </select>
        </td>
        <td class="comments">${taskData[obj].comments}</td>
        <td class="dropdownstatus">

         <select class = "dropdown" name="status" id="status${obj}">
         <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
         <option value="Yet to start">Yet to start</option>
           <option value="In Progress">In Progress</option>
           <option value="Completed">Completed</option>
           <option value="Pending">Pending</option>
         </select>
         </td>
        <td class="crudbuttons">
          <button class="update"  onclick="updateTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
          <button class="delete"  onclick="deleteTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-trash"></i></button>
        </td>
    </tr>`
      taskId= taskData[obj].taskId;
    }   
    
    adminTaskTable += `</tbody></table></main></body></html>`
  
    document.getElementById("adminPage").innerHTML=adminTaskTable;
    search_sort();
    
}
function search_sort() {
  document.getElementById("search").addEventListener("input", function () {
    var input, filter, table, tbody, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("admintable");
    tbody = document.getElementById("diplayAllTaskAssigned");
    tr = tbody.getElementsByTagName("tr");
 
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (var j = 0; j < td.length; j++) {
        txtValue = td[j].textContent || td[j].innerText ||td[j].getElementsByTagName("td")[0];
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break; // Break the inner loop to avoid displaying the row multiple times
        } else
        {
     
          tr[i].style.display = "none";
        }
      }
    }
  });
}
function search_sort_for_filter_status() {
  document.getElementById("search").addEventListener("input", function () {
    var input, filter, table, tbody, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("admintable");
    tbody = document.getElementById("adminFilterTaskStatusData");
    tr = tbody.getElementsByTagName("tr");
 
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (var j = 0; j < td.length; j++) {
        txtValue = td[j].textContent || td[j].innerText ||td[j].getElementsByTagName("td")[0];
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break; // Break the inner loop to avoid displaying the row multiple times
        } else
        {
     
          tr[i].style.display = "none";
        }
      }
    }
  });
}
function displayAdminTaskFilterData(checkstatus="All"){
  document.getElementById("diplayAllTaskAssigned").style.display="none";
  let assigny_list;
    for(let user in userList){
      assigny_list+=`<option value="${userList[user].name}">${userList[user].name}</option>`
    }
  console.log("status",checkstatus);
  let adminStatusFilter="";
    if(checkstatus=="All"){
      for(let obj in taskData){
        adminStatusFilter+=`<tr class="user" id="user1">
        <td class="issuedate">${admincreatedAtDate[obj]}</td>
        <td class="updatedate">${adminupdatedAtDate[obj]}</td>
        <td class="taskId">${taskData[obj].taskId}</td>
          <td class="tasktitle">${taskData[obj].title}</td>
          <td class="usertaskdesc">${taskData[obj].description}</td>
          <td class="assto">
          <select class = "assignydropdown" name="assignto" id="assignto${obj}">
          <option disabled ="" selected ="" value="${taskData[obj].assigned_to}">${taskData[obj].assigned_to}</option>
          ${assigny_list}
          </select>
          </td>
          <td class="comments">${taskData[obj].comments}</td>
          <td class="dropdownstatus">

          <select class = "dropdown" name="status" id="status${obj}">
          <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
          <option value="Yet to start">Yet to start</option>
          <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            
          </select>
          </td>
          <td>
            <button class="update"  onclick="updateTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
            <button class="delete"  onclick="deleteTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-trash"></i></button>
          </td>
      </tr>`

    }
    document.getElementById("adminFilterTaskStatusData").innerHTML=adminStatusFilter;
    search_sort_for_filter_status();
  }else if (checkstatus=="Yet to start"){
      for(let obj in taskData){
        if(taskData[obj].status==='Yet to start'){
          adminStatusFilter+=`<tr class="user" id="user1">
          <td class="issuedate">${admincreatedAtDate[obj]}</td>
          <td class="updatedate">${adminupdatedAtDate[obj]}</td>
          <td class="taskId">${taskData[obj].taskId}</td>
            <td class="tasktitle">${taskData[obj].title}</td>
            <td class="usertaskdesc">${taskData[obj].description}</td>
            <td class="assto">
            <select class = "assignydropdown" name="assignto" id="assignto${obj}">
            <option disabled ="" selected ="" value="${taskData[obj].assigned_to}">${taskData[obj].assigned_to}</option>
            ${assigny_list}
            </select>
            </td>
            <td class="comments">${taskData[obj].comments}</td>
            <td class="dropdownstatus">

            <select class = "dropdown" name="status" id="status${obj}">
            <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
            <option value="Yet to start">Yet to start</option>
            <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              
            </select>
            </td>
            <td>
              <button class="update"  onclick="updateTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
              <button class="delete"  onclick="deleteTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-trash"></i></button>
            </td>
        </tr>`
        }
    }
    document.getElementById("adminFilterTaskStatusData").innerHTML=adminStatusFilter;
    search_sort_for_filter_status();
  }else if (checkstatus=="In Progress"){
      for(let obj in taskData){
        if(taskData[obj].status==='In Progress'){
          adminStatusFilter+=`<tr class="user" id="user1">
          <td class="issuedate">${admincreatedAtDate[obj]}</td>
          <td class="updatedate">${adminupdatedAtDate[obj]}</td>
          <td class="taskId">${taskData[obj].taskId}</td>
            <td class="tasktitle">${taskData[obj].title}</td>
            <td class="usertaskdesc">${taskData[obj].description}</td>
            <td class="assto">
            <select class = "assignydropdown" name="assignto" id="assignto${obj}">
            <option disabled ="" selected ="" value="${taskData[obj].assigned_to}">${taskData[obj].assigned_to}</option>
            ${assigny_list}
            </select>
            </td>
            <td class="comments">${taskData[obj].comments}</td>
            <td class="dropdownstatus">

            <select class = "dropdown" name="status" id="status${obj}">
            <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
            <option value="Yet to start">Yet to start</option>
            <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              
            </select>
            </td>
            <td>
              <button class="update"  onclick="updateTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
              <button class="delete"  onclick="deleteTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-trash"></i></button>
            </td>
        </tr>`
        }
    }
    document.getElementById("adminFilterTaskStatusData").innerHTML=adminStatusFilter;
    search_sort_for_filter_status();
  }else if (checkstatus=="Completed"){
      for(let obj in taskData){
        if(taskData[obj].status==='Completed'){
          adminStatusFilter+=`<tr class="user" id="user1">
          <td class="issuedate">${admincreatedAtDate[obj]}</td>
          <td class="updatedate">${adminupdatedAtDate[obj]}</td>
          <td class="taskId">${taskData[obj].taskId}</td>
            <td class="tasktitle">${taskData[obj].title}</td>
            <td class="usertaskdesc">${taskData[obj].description}</td>
            <td class="assto">
            <select class = "assignydropdown" name="assignto" id="assignto${obj}">
            <option disabled ="" selected ="" value="${taskData[obj].assigned_to}">${taskData[obj].assigned_to}</option>
            ${assigny_list}
            </select>
            </td>
            <td class="comments">${taskData[obj].comments}</td>
            <td class="dropdownstatus">

            <select class = "dropdown" name="status" id="status${obj}">
            <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
            <option value="Yet to start">Yet to start</option>
            <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              
            </select>
            </td>
            <td>
              <button class="update"  onclick="updateTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
              <button class="delete"  onclick="deleteTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-trash"></i></button>
            </td>
        </tr>`
        }
    }
    document.getElementById("adminFilterTaskStatusData").innerHTML=adminStatusFilter;
    search_sort_for_filter_status();
  }else if (checkstatus=="Pending"){
      for(let obj in taskData){
        if(taskData[obj].status==='Pending'){
          adminStatusFilter+=`<tr class="user" id="user1">
          <td class="issuedate">${admincreatedAtDate[obj]}</td>
          <td class="updatedate">${adminupdatedAtDate[obj]}</td>
          <td class="taskId">${taskData[obj].taskId}</td>
            <td class="tasktitle">${taskData[obj].title}</td>
            <td class="usertaskdesc">${taskData[obj].description}</td>
            <td class="assto">
            <select class = "assignydropdown" name="assignto" id="assignto${obj}">
            <option disabled ="" selected ="" value="${taskData[obj].assigned_to}">${taskData[obj].assigned_to}</option>
            ${assigny_list}
            </select>
            </td>
            <td class="comments">${taskData[obj].comments}</td>
            <td class="dropdownstatus">

            <select class = "dropdown" name="status" id="status${obj}">
            <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
            <option value="Yet to start">Yet to start</option>
            <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              
            </select>
            </td>

            <td>
              <button class="update"  onclick="updateTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
              <button class="delete"  onclick="deleteTask(${obj});" "type="button" id="1"><i class="fa-solid fa fa-trash"></i></button>
            </td>
        </tr>`
        }
    }
    document.getElementById("adminFilterTaskStatusData").innerHTML=adminStatusFilter;
    search_sort_for_filter_status();
  }
}
function updateTask(id){
  event.preventDefault();
  let task_assigned_to = document.getElementById(`assignto${id}`).value;
  let status_selected = document.getElementById(`status${id}`).value;
  // console.log("assto",task_assigned_to);
  // console.log("status",status_selected);
  const updateconfirm = confirm('Confirm Update');
    if(updateconfirm){
      const http = new XMLHttpRequest();
      http.open("PUT", `http://localhost:3000/task/${taskData[id]._id}`,true);
      // http.setRequestHeader("Authorization",localStorage.getItem("token"))
      http.setRequestHeader( "Content-Type","application/json");
      http.send(JSON.stringify({
          "assigned_to":task_assigned_to,
          "status":status_selected 
      }));
      http.onreadystatechange = function () 
      {
              if (this.readyState == 4){
                  if(this.status == 200) {
              const newobj = this.responseText;
              console.log(newobj);
              if(newobj==="Updated Successfully")
              adminTask();
              }	
          }
      }
      
  }
  
}
function deleteTask(id){
  event.preventDefault();
  const deleteconfirm = confirm('Are you sure you want to delete the task?');
    if(deleteconfirm){
      const http = new XMLHttpRequest();
      http.open("DELETE", `http://localhost:3000/task/${taskData[id]._id}`,true);
      // http.setRequestHeader("Authorization",localStorage.getItem("token"))
      http.setRequestHeader( "Content-Type","application/json");
      http.send();
      http.onreadystatechange = function () 
      {
              if (this.readyState == 4){
                  if(this.status == 200) {
              const newobj = this.responseText;
              console.log(newobj);
              if(newobj==="Deleted Successfully")
              adminTask();
              }	
          }
      }
      
  }
}
function clearAdminLogin(){
  // console.log("checking");
  let logoutconfirm = confirm('Are you sure you need to logout?');
  if(logoutconfirm){
    localStorage.removeItem("AdminToken");
    localStorage.removeItem("AdminUserName");
    location.href="admin.html"
  }
  
}
function addTaskButton(){
  var userPlus = document.getElementById("addTask");
  var addModal = document.getElementById("modalAddUser");
    userPlus.addEventListener("click", () => {
      addModal.style.display = "block";

  })

  window.addEventListener("click", (event)=> {
      if (event.target == addModal) {
        addModal.style.display = "none";
      }
  });

}
function addTask(){
  let newtitle = document.getElementById("inputTitle").value;
    let newdescription = document.getElementById("inputDescription").value;
    let newassigned_to = document.getElementById("inputName").value;
    let newstatus = document.getElementById("inputStatus").value;
    console.log("task ID",taskId);
    const http = new XMLHttpRequest();
    http.open("POST", `http://localhost:3000/task`,true);
    http.setRequestHeader("Content-Type", "application/json");
    http.send(JSON.stringify({
        "taskId":taskId+1,
        "title":newtitle,
        "description": newdescription,
        "assigned_to": newassigned_to,
        "status":newstatus
    }));
	http.onreadystatechange = function () {
		if (this.readyState == 4 ){
      if(this.status == 201) {
          const newobj = this.responseText;
          if(newobj==="Task Added Successfully"){
            adminTask();   
            
          }
      }
    }
  }
}

function UserTask(){
  setInterval( function(){
    // console.log("Ths is set interval");
    const http = new XMLHttpRequest();
      http.open("GET", `http://localhost:3000/task`,true);
      // http.setRequestHeader("Authorization",localStorage.getItem("token"))
      http.setRequestHeader("Content-Type", "application/json");
      http.send();
      http.onreadystatechange =  function () {
        if (this.readyState == 4 ){
              if(this.status == 200) {
                alertTaskData = JSON.parse(this.responseText);
                  // console.log(alertTaskData);
                   alertUser();
              }
              
          }
      }},3000)
      for(let i in taskData){
        const utcDateTime = taskData[i].createdAt;
        const utcDate = new Date(utcDateTime);
        const istDate = new Date(utcDate.getTime() + 19800000); // Convert UTC timestamp to IST
        const istDateString = istDate.toLocaleDateString();
        const istTimeString = istDate.toLocaleTimeString();
        // const finalcreateddate = istDateString +" "+ istTimeString
        createdAtDate.push(istDateString);

        const updateutcDateTime = taskData[i].updatedAt;
        const updateutcDate = new Date(updateutcDateTime);
        const updateistDate = new Date(updateutcDate.getTime() + 19800000); // Convert UTC timestamp to IST
        const updateistDateString = updateistDate.toLocaleDateString();
        // const istTimeString = istDate.toLocaleTimeString();
        updatedAtDate.push(updateistDateString);
      }
    console.log("Created At data",createdAtDate)
    console.log("Updated At data",updatedAtDate)
  // for(let i in taskData){
  //   if(taskData[i].assigned_to === localStorage.getItem("UserName")){
      // console.log("Name",taskData[i].assigned_to)
      let userTaskDisplay = `
        <html>
        <title>
            Task Tracker
        </title>
        <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
        <link rel="stylesheet" href="./lib/bootstrap.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Didact+Gothic&amp;display=swap" rel="stylesheet">
        <script src="./lib/bootstrap.bundle.min.js"></script>
        <script src="./lib/bootstrap.bundle.min.js"></script>
        <link rel="stylesheet" type="text/css" href="./css/adminTask.css">
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
        </head>
       
    
        <header>
         <button class=""  onclick="allTaskDisplay();" "type="button" id="1">All User Tasks</button>&nbsp;
         <button class=""  onclick="userTask();" "type="button" id="1">My Tasks</button>
         <span class="usersearchspan"><input type="text" name="comments" id="usersearch" placeholder="Search you tasks here..." class="searchinputfield" ></span>
            <p id = "headername"> Hi ${localStorage.getItem("UserName")}, Kindly go through the tasks you have </p> 
            <div id="grow">
            </div>
            <div class="drop">
                   <label for="statusfilter">Check Statuses of Tasks:</label>

                    <select name="statusfilter" id="statusfilter" onclick="displayTaskFilterData(value)">
                    <option value="All">All</option>
                    <option value="Yet to start">Yet to start</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    </select></div>
            <button id = "signoutbtn" onClick="clearUserLogin();" type="button"><i id="signout" class="fa-solid fa fa-sign-out" ></i></button>

        </header>
        <body>
        <main>
           
            <table id="usertable">
                <tr id="tableHeadings">
                    <th class="issuedatehead">Issued At</th>
                    <th class="updatedatehead">Updated At</th>
                    <th class="taskIdhead">Task ID</th>
                    <th class="titlehead">Title</th>
                    <th class="deschead">Description</th>
                    <th class="dropdownstatushead">Status</th>
                    <th class="commentshead">Comments</th>
                    <th class="useredithead"></th>
                </tr>
                <tbody id="userTaskStatusData"></tbody>
                <tbody id = "allStatus">
                `
                for(let obj in taskData){
                  if(taskData[obj].assigned_to === localStorage.getItem("UserName")){
                      userTaskDisplay+=`<tr class="user" id="user1">
                      <td class="issuedate">${createdAtDate[obj]}</td>
                      <td class="updatedate">${updatedAtDate[obj]}</td>
                      <td class="taskId">${taskData[obj].taskId}</td>
                        <td class="tasktitle">${taskData[obj].title}</td>
                        <td class="usertaskdesc">${taskData[obj].description}</td>
                        
                        <td class="dropdownstatus">
                
                        <select class = "userdropdown" name="status" id="status${obj}" >
                        <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
                          <option value="Yet to start">Yet to start</option>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          
                        </select>
                        </td>
                        <td> <input type="text" name="comments" id="comments${obj}" placeholder="Enter status comments" class="userinput-field" value="${taskData[obj].comments}"></td>
                        <td>
                          <button class="userupdate"  onclick="updateUserStatus(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
                        </td>
                    </tr>`
                    
                    
                  }
                }
                userTaskDisplay += `</tbody></table> </main><main><table id="allTaskUserDisplay"></table></main>
                
                </body></html>`
      
      document.getElementById("userPage").innerHTML=userTaskDisplay;
      usersearch();
  
    // }
  // }
}
// function changeIcon(anchor){
//   var icon = anchor.querySelector("i");
//   icon.classList.toggle('fa-arrow-up');
//   icon.classList.toggle('fa-arrow-down');

//    anchor.querySelector("th").tableContent = icon.classList.contains('fa-arrow-up') ? userTask() : allTaskDisplay();
// }

function allTaskDisplay(){
  document.getElementById("usertable").style.display="none";
  let allTaskDisplayUser="";
  allTaskDisplayUser+=`
  <table id="usertable">
                <tr id="tableHeadings">
                <th class="issuedatehead">Issued At</th>
                <th class="updatedatehead">Updated At</th>
                <th class="taskIdhead">Task ID</th>
                <th class="titlehead">Title</th>
                <th class="deschead">Description</th>
                <th class="asshead">Assigned to</th>
                <th class="commentshead">Comments</th>
                <th class="dropdownstatushead">Status</th>
                </tr><tbody id="allTaskStatusData"></tbody><tbody id = "allUserStatus">
  `
  for(let obj in taskData){
      allTaskDisplayUser+=`<tr class="user" id="user1">
      <td class="issuedate">${createdAtDate[obj]}</td>
      <td class="updatedate">${updatedAtDate[obj]}</td>
      <td class="taskId">${taskData[obj].taskId}</td>
          <td class="tasktitle">${taskData[obj].title}</td>
          <td class="taskdesc">${taskData[obj].description}</td>
          <td class="dropdownstatus">${taskData[obj].assigned_to}</td>
          <td class="comments">${taskData[obj].comments}</td>
          <td class="dropdownstatus">${taskData[obj].status}</td>
          
      </tr>`
      
    
  }
  allTaskDisplayUser+=`</tbody></table>`
  document.getElementById("allTaskUserDisplay").innerHTML=allTaskDisplayUser;
  allusersearch();
}
function alertUser(){
  for(let i in alertTaskData){
    if(alertTaskData[i].assigned_to === localStorage.getItem("UserName") && alertTaskData[i].notification===1){
      // toastr["success"]("Have a look please", "New Task Added")

      // toastr.options = {
      //   "closeButton": true,
      //   "debug": false,
      //   "newestOnTop": false,
      //   "progressBar": false,
      //   "positionClass": "toast-top-right",
      //   "preventDuplicates": false,
      //   "onclick": null,
      //   "showDuration": "300",
      //   "hideDuration": "1000",
      //   "timeOut": "5000",
      //   "extendedTimeOut": "1000",
      //   "showEasing": "swing",
      //   "hideEasing": "linear",
      //   "showMethod": "fadeIn",
      //   "hideMethod": "fadeOut"
      // }
    toastr.success(`${alertTaskData[i].title}<br /><br /><button type='button' class='btn clear' onclick="taskAccept(${i});">Accept</button><button type='button' class='btn clear'onclick="taskDecline(${i});">Decline</button>`, "New Task Added");


    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": false,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": 0,
      "extendedTimeOut": 0,
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut",
      "tapToDismiss": false
    }
      
      console.log("New taskkkkkkkk");
      // alert("New Task Added ");
      // updatenotification(i);
    }
}
}
function taskAccept(id){
  console.log("Notifieeeedddddddddddd");
  const http = new XMLHttpRequest();
          http.open("PUT", `http://localhost:3000/task/${alertTaskData[id]._id}`,true);
          // http.setRequestHeader("Authorization",localStorage.getItem("token"))
          http.setRequestHeader( "Content-Type","application/json");
          http.send(JSON.stringify({
              "notification":0
          }));
          http.onreadystatechange = function () {
                  if (this.readyState == 4){
                      if(this.status == 200) {
                  const newobj = this.responseText;
                  console.log(newobj);
                  if(newobj==="Updated Successfully")
                  userTask();
                  }	
              }
          }
}
function taskDecline(id){

  let declinename=localStorage.getItem("UserName");
  taskDeclinedName=declinename + " Declined";
  localStorage.setItem("taskDeclinedName",taskDeclinedName);

  const http = new XMLHttpRequest();
  http.open("PUT", `http://localhost:3000/task/${alertTaskData[id]._id}`,true);
  // http.setRequestHeader("Authorization",localStorage.getItem("token"))
  http.setRequestHeader( "Content-Type","application/json");
  http.send(JSON.stringify({
      "assigned_to":declinename + " Declined"
  }));
  http.onreadystatechange = function () {
          if (this.readyState == 4){
              if(this.status == 200) {
          const newobj = this.responseText;
          console.log(newobj);
          }	
      }
  }
}
function displayTaskFilterData(currentstatus="All"){
  document.getElementById("allStatus").style.display="none";
  console.log("status",currentstatus);
  let userStatusFilter="";
  if(currentstatus=="All"){
    for(let obj in taskData){
        if(taskData[obj].assigned_to === localStorage.getItem("UserName")){
          userStatusFilter+=`<tr class="user" id="user1">
          <td class="issuedate">${createdAtDate[obj]}</td>
          <td class="updatedate">${updatedAtDate[obj]}</td>
          <td class="taskId">${taskData[obj].taskId}</td>
              <td class="tasktitle">${taskData[obj].title}</td>
              <td class="usertaskdesc">${taskData[obj].description}</td>
              <td class="dropdownstatus">
      
              <select class = "userdropdown" name="status" id="status${obj}">
              <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
                <option value="Yet to start">Yet to start</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
               
              </select>
              </td>
              <td> <input type="text" name="comments" id="comments" placeholder="Enter status comments" class="userinput-field" value="${taskData[obj].comments}"></td>
              <td>
                <button class="userupdate"  onclick="updateUserStatus(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
              </td>
          </tr>`
          document.getElementById("userTaskStatusData").innerHTML=userStatusFilter;
          userfiltersearch();
        }
      }
  }else if(currentstatus=="Yet to start"){
    for(let obj in taskData){
      if(taskData[obj].assigned_to === localStorage.getItem("UserName") && taskData[obj].status==='Yet to start'){
          userStatusFilter+=`<tr class="user" id="user1">
          <td class="issuedate">${createdAtDate[obj]}</td>
          <td class="updatedate">${updatedAtDate[obj]}</td>
          <td class="taskId">${taskData[obj].taskId}</td>
              <td class="tasktitle">${taskData[obj].title}</td>
              <td class="usertaskdesc">${taskData[obj].description}</td>
              <td class="dropdownstatus">
      
              <select class = "userdropdown" name="status" id="status${obj}">
              <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
                <option value="Yet to start">Yet to start</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                
              </select>
              </td>
              <td> <input type="text" name="comments" id="comments" placeholder="Enter status comments" class="userinput-field" value="${taskData[obj].comments}"></td>
              <td>
                <button class="userupdate"  onclick="updateUserStatus(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
              </td>
          </tr>`
          document.getElementById("userTaskStatusData").innerHTML=userStatusFilter;
          userfiltersearch();
      }
    }
  }else if(currentstatus=="In Progress"){
    for(let obj in taskData){
      if(taskData[obj].assigned_to === localStorage.getItem("UserName") && taskData[obj].status==='In Progress'){
          userStatusFilter+=`<tr class="user" id="user1">
          <td class="issuedate">${createdAtDate[obj]}</td>
          <td class="updatedate">${updatedAtDate[obj]}</td>
          <td class="taskId">${taskData[obj].taskId}</td>
              <td class="tasktitle">${taskData[obj].title}</td>
              <td class="usertaskdesc">${taskData[obj].description}</td>
              <td class="dropdownstatus">
      
              <select class = "userdropdown" name="status" id="status${obj}">
              <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
                <option value="Yet to start">Yet to start</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                
              </select>
              </td>
              <td> <input type="text" name="comments" id="comments" placeholder="Enter status comments" class="userinput-field" value="${taskData[obj].comments}"></td>
              <td>
                <button class="userupdate"  onclick="updateUserStatus(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
              </td>
          </tr>`
          document.getElementById("userTaskStatusData").innerHTML=userStatusFilter;
          userfiltersearch();
      }
    }
  }else if(currentstatus=="Completed"){
    for(let obj in taskData){
      if(taskData[obj].assigned_to === localStorage.getItem("UserName") && taskData[obj].status==='Completed'){
          userStatusFilter+=`<tr class="user" id="user1">
          <td class="issuedate">${createdAtDate[obj]}</td>
          <td class="updatedate">${updatedAtDate[obj]}</td>
          <td class="taskId">${taskData[obj].taskId}</td>
              <td class="tasktitle">${taskData[obj].title}</td>
              <td class="usertaskdesc">${taskData[obj].description}</td>
              <td class="dropdownstatus">
      
              <select class = "userdropdown" name="status" id="status${obj}">
              <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
                <option value="Yet to start">Yet to start</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
               x
              </select>
              </td>
              <td> <input type="text" name="comments" id="comments" placeholder="Enter status comments" class="userinput-field" value="${taskData[obj].comments}"></td>
              <td>
                <button class="userupdate"  onclick="updateUserStatus(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
              </td>
          </tr>`
          document.getElementById("userTaskStatusData").innerHTML=userStatusFilter;
          userfiltersearch();
      }
    }
  }else if(currentstatus=="Pending"){
    for(let obj in taskData){
      if(taskData[obj].assigned_to === localStorage.getItem("UserName") && taskData[obj].status==='Pending'){
          userStatusFilter+=`<tr class="user" id="user1">
          <td class="issuedate">${createdAtDate[obj]}</td>
          <td class="updatedate">${updatedAtDate[obj]}</td>
          <td class="taskId">${taskData[obj].taskId}</td>
              <td class="tasktitle">${taskData[obj].title}</td>
              <td class="usertaskdesc">${taskData[obj].description}</td>
              <td class="dropdownstatus">
      
              <select class = "userdropdown" name="status" id="status${obj}">
              <option disabled ="" selected ="" value="${taskData[obj].status}">${taskData[obj].status}</option>
                <option value="Yet to start">Yet to start</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                
              </select>
              </td>
              <td> <input type="text" name="comments" id="comments" placeholder="Enter status comments" class="userinput-field" value="${taskData[obj].comments}"></td>
              <td>
                <button class="userupdate"  onclick="updateUserStatus(${obj});" "type="button" id="1"><i class="fa-solid fa fa-refresh"></i></button>
              </td>
          </tr>`
          document.getElementById("userTaskStatusData").innerHTML=userStatusFilter;
          userfiltersearch();

      }
    }
  }
  let allUserTaskFilter =""
  if(currentstatus=="All"){
    document.getElementById("allUserStatus").style.display="none";
    for(let obj in taskData){
      allUserTaskFilter+=`<tr class="user" id="user1">
      <td class="issuedate">${createdAtDate[obj]}</td>
      <td class="updatedate">${updatedAtDate[obj]}</td>
      <td class="taskId">${taskData[obj].taskId}</td>
      <td class="tasktitle">${taskData[obj].title}</td>
      <td class="taskdesc">${taskData[obj].description}</td>
      <td class="dropdownstatus">${taskData[obj].assigned_to}</td>
      <td class="comments">${taskData[obj].comments}</td>
      <td class="dropdownstatus">${taskData[obj].status}</td>
      
  </tr>`
          document.getElementById("allTaskStatusData").innerHTML=allUserTaskFilter;
          allusersearchfilter();
        
      }
  }else if(currentstatus=="Yet to start"){
    for(let obj in taskData){
      if(taskData[obj].status==='Yet to start'){
        allUserTaskFilter+=`<tr class="user" id="user1">
        <td class="issuedate">${createdAtDate[obj]}</td>
        <td class="updatedate">${updatedAtDate[obj]}</td>
        <td class="taskId">${taskData[obj].taskId}</td>
          <td class="tasktitle">${taskData[obj].title}</td>
          <td class="taskdesc">${taskData[obj].description}</td>
          <td class="dropdownstatus">${taskData[obj].assigned_to}</td>
          <td class="comments">${taskData[obj].comments}</td>
          <td class="dropdownstatus">${taskData[obj].status}</td>
          
      </tr>`
          document.getElementById("allTaskStatusData").innerHTML=allUserTaskFilter;
          allusersearchfilter();
      }
    }
  }else if(currentstatus=="In Progress"){
    for(let obj in taskData){
      if(taskData[obj].status==='In Progress'){
        allUserTaskFilter+=`<tr class="user" id="user1">
        <td class="issuedate">${createdAtDate[obj]}</td>
        <td class="updatedate">${updatedAtDate[obj]}</td>
        <td class="taskId">${taskData[obj].taskId}</td>
          <td class="tasktitle">${taskData[obj].title}</td>
          <td class="taskdesc">${taskData[obj].description}</td>
          <td class="dropdownstatus">${taskData[obj].assigned_to}</td>
          <td class="comments">${taskData[obj].comments}</td>
          <td class="dropdownstatus">${taskData[obj].status}</td>
          
      </tr>`
          document.getElementById("allTaskStatusData").innerHTML=allUserTaskFilter;
          allusersearchfilter();
      }
    }
  }else if(currentstatus=="Completed"){
    for(let obj in taskData){
      if(taskData[obj].status==='Completed'){
        allUserTaskFilter+=`<tr class="user" id="user1">
        <td class="issuedate">${createdAtDate[obj]}</td>
        <td class="updatedate">${updatedAtDate[obj]}</td>
        <td class="taskId">${taskData[obj].taskId}</td>
          <td class="tasktitle">${taskData[obj].title}</td>
          <td class="taskdesc">${taskData[obj].description}</td>
          <td class="dropdownstatus">${taskData[obj].assigned_to}</td>
          <td class="comments">${taskData[obj].comments}</td>
          <td class="dropdownstatus">${taskData[obj].status}</td>
          
      </tr>`
          document.getElementById("allTaskStatusData").innerHTML=allUserTaskFilter;
          allusersearchfilter();
      }
    }
  }else if(currentstatus=="Pending"){
    for(let obj in taskData){
      if(taskData[obj].status==='Pending'){
        allUserTaskFilter+=`<tr class="user" id="user1">
        <td class="issuedate">${createdAtDate[obj]}</td>
        <td class="updatedate">${updatedAtDate[obj]}</td>
        <td class="taskId">${taskData[obj].taskId}</td>
          <td class="tasktitle">${taskData[obj].title}</td>
          <td class="taskdesc">${taskData[obj].description}</td>
          <td class="dropdownstatus">${taskData[obj].assigned_to}</td>
          <td class="comments">${taskData[obj].comments}</td>
          <td class="dropdownstatus">${taskData[obj].status}</td>
          
      </tr>`
          document.getElementById("allTaskStatusData").innerHTML=allUserTaskFilter;
          allusersearchfilter();
      }
    }
  }
}
function updateUserStatus(id){
  event.preventDefault();
  let status_selected = document.getElementById(`status${id}`).value;
  let commentswritten = document.getElementById(`comments${id}`).value;
  // console.log("assto",task_assigned_to);
  // console.log("status",status_selected);
  const updateconfirm = confirm('Confirm Update');
    if(updateconfirm){
      const http = new XMLHttpRequest();
      http.open("PUT", `http://localhost:3000/task/${taskData[id]._id}`,true);
      // http.setRequestHeader("Authorization",localStorage.getItem("token"))
      http.setRequestHeader( "Content-Type","application/json");
      http.send(JSON.stringify({
          "status":status_selected,
          "comments":commentswritten
      }));
      http.onreadystatechange = function () 
      {
              if (this.readyState == 4){
                  if(this.status == 200) {
              const newobj = this.responseText;
              console.log(newobj);
              if(newobj==="Updated Successfully")
              userTask();
              }	
          }
      }
      
  }
  
}


function clearUserLogin(){
  // console.log("checking");
  let logoutconfirm = confirm('Are you sure you need to logout?');
  if(logoutconfirm){
    localStorage.removeItem("Token");
    localStorage.removeItem("UserName");
    location.href="index.html";
    
  }
  
}
function usersearch() {
  document.getElementById("usersearch").addEventListener("input", function () {
    var input, filter, table, tbody, tr, td, i, txtValue;
    input = document.getElementById("usersearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("usertable");
    tbody = document.getElementById("allStatus");
    tr = tbody.getElementsByTagName("tr");
 
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (var j = 0; j < td.length; j++) {
        txtValue = td[j].textContent || td[j].innerText ||td[j].getElementsByTagName("td")[0];
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break; // Break the inner loop to avoid displaying the row multiple times
        } else
        {
     
          tr[i].style.display = "none";
        }
      }
    }
  });
}
function userfiltersearch() {
  document.getElementById("usersearch").addEventListener("input", function () {
    var input, filter, table, tbody, tr, td, i, txtValue;
    input = document.getElementById("usersearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("usertable");
    tbody = document.getElementById("userTaskStatusData");
    tr = tbody.getElementsByTagName("tr");
 
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (var j = 0; j < td.length; j++) {
        txtValue = td[j].textContent || td[j].innerText ||td[j].getElementsByTagName("td")[0];
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break; // Break the inner loop to avoid displaying the row multiple times
        } else
        {
     
          tr[i].style.display = "none";
        }
      }
    }
  });
}
function allusersearch() {
  document.getElementById("usersearch").addEventListener("input", function () {
    var input, filter, table, tbody, tr, td, i, txtValue;
    input = document.getElementById("usersearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("allTaskUserDisplay");
    tbody = document.getElementById("allUserStatus");
    tr = tbody.getElementsByTagName("tr");
 
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (var j = 0; j < td.length; j++) {
        txtValue = td[j].textContent || td[j].innerText ||td[j].getElementsByTagName("td")[0];
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break; // Break the inner loop to avoid displaying the row multiple times
        } else
        {
     
          tr[i].style.display = "none";
        }
      }
    }
  });
}
function allusersearchfilter() {
  document.getElementById("usersearch").addEventListener("input", function () {
    var input, filter, table, tbody, tr, td, i, txtValue;
    input = document.getElementById("usersearch");
    filter = input.value.toUpperCase();
    table = document.getElementById("allTaskUserDisplay");
    tbody = document.getElementById("allTaskStatusData");
    tr = tbody.getElementsByTagName("tr");
 
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td");
      for (var j = 0; j < td.length; j++) {
        txtValue = td[j].textContent || td[j].innerText ||td[j].getElementsByTagName("td")[0];
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break; // Break the inner loop to avoid displaying the row multiple times
        } else
        {
     
          tr[i].style.display = "none";
        }
      }
    }
  });
}