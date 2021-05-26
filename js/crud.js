/*
url => link to overview
keys => array with the parameters/keys of your items
key_id => key which is used as id
table needs to have #overview
 */

let tbody = $("#overview");

let create_form = $("#create_form");

let search_form = $("#search_form");
let search_id = document.getElementById("search_id");

let update_form = $("#update_form");

document.getElementById("found").style.display = "none";
document.getElementById("clear").onclick = notFound;

$(function (){
    refreshTBODY();
    create_form.submit(function (e){e.preventDefault();submitCreate();});
    search_form.submit(function (e){e.preventDefault();submitSearch();});
    update_form.submit(function (e){e.preventDefault();submitUpdate();});
    //setInterval(refreshTable,10000);
})

/*
function createTHEAD(keys){
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    for (const key of keys){
        let th = document.createElement("th");
        th.innerText = key;
        tr.append(th);
    }
    tr.append(document.createElement("th"));
    thead.append(tr);
    table.append(thead);
}*/

function refreshTBODY(){
    tbody.empty();
    $.getJSON(url_get_all,function (json){
        $.each(json, function(index, item){
            let tr = createTR(item);
            tbody.append(tr);
        })
    })
}

function createTR(item){
    let tr = document.createElement("tr");
    for (const key of keys){
        let td = document.createElement("td");
        td.innerText = item[key];
        tr.append(td);
    }
    let td = document.createElement("td");
    td.append(createDeleteButton(item));
    tr.append(td);
    return tr;
}

function createDeleteButton(item){
    let button = document.createElement("button");
    button.innerText = "Delete";
    button.onclick = function () {$.ajax({
        method: "DELETE",
        url: url_delete + item[key_id] + "/",
        success: refreshTBODY
    })};
    button.className = "btn-secondary";
    return button
}

function submitCreate(){
    $.ajax({
        url: url_add,
        type: "POST",
        data: create_form.serialize(),
        success: refreshTBODY,
        error: function (xhr, status, error) {alert("something went wrong: " + xhr.responseText)}
    })
}

function submitSearch(){
    if (search_id.value !== ""){
        $.ajax({
            url: url_get_one + search_id.value + "/",
            type: "GET",
            dataType: "json",
            success: function(json) {found(json);},
            error: notFound
        })
    }
    document.getElementById("found").style.display = "none";
}

function notFound(){
    search_id.value = "";
    document.getElementById("found").style.display = "none";
}

function found(item){
    document.getElementById("found").style.display = "block";
    for (const key of keys){
        document.getElementById("update_" + key).value = item[key];
    }
}

function submitUpdate(){
    $.ajax({
        url: url_update + document.getElementById("update_id").value + "/",
        type: "PUT",
        data: update_form.serialize(),
        success: refreshTBODY,
        error: function (xhr, status, error) {alert("something went wrong: " + xhr.responseText)}
    })
}
