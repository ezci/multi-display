function getElementIndex(el) {
    if (!el) return -1
    var i = -1
    do {
        i++
    } while (el = el.previousElementSibling)
    return i
}

function fillinTable(json, table){
    var thead = document.createElement('thead')
    var tbody = document.createElement('tbody')
    var hrow = document.createElement("tr")
    table.appendChild(thead)
    table.appendChild(tbody)
    thead.appendChild(hrow)
    
    for(var i=0;i<json.columns.length;i++){
        headerText = document.createTextNode(json.columns[i])
        header = document.createElement("th")
        header.appendChild(headerText)
        hrow.appendChild(header)
    }
    
    for(var i=0;i<json.rows.length;i++){
        var row = document.createElement("tr")
        for(var j=0;j<json.rows[i].length;j++){
            td = document.createElement("td")
            td.innerHTML = json.rows[i][j]
            row.appendChild(td)
        }
        tbody.appendChild(row)
    }
}

function loadTable( tableId, json) {
    if(!json.rows || json.rows.length ==0){
        $("#screens").hide()
        $(".command").hide()    
        return
    }
    var table = document.getElementById(tableId)
    table.innerHTML = ""
    fillinTable(json, table)
    var row = table.getElementsByTagName('tr')[0]
    cols = row ? row.children : undefined
    if (!cols) return
    for (var i=0;i<cols.length;i++){
        cols[i].style.position = 'relative'
    }
    $("#screens").show()
    $(".command").show()
    $("input[name='commandRadio']:first").attr('checked', true)    
}

var json = {"columns": ["", "display #", "port", "size", "url", ""], 
            "rows": [] }

function getUrlBlock(url){
    return "<a href='"+url+"' target='_blank'>"+url+"</a>"
}

function getRadio(displayId){
    return "<input value='"+displayId+"' name='commandRadio' type='radio' \/>"
}

function getremoveBlock(displayId){
    return "<button class='removeButton' onClick='removeScreen("+displayId+", this)'>Remove</button>";
}

function alertMessage(msg){
    $('<div class="msg">'+msg+'</div>').insertBefore('.message').delay(3000).fadeOut()
}

function runCommand(displayId){
    $.ajax({
        url: 'run',
        type: 'POST',
        data: {
            "id":displayId, "command": $("#commandInput").val()
        },
        success: function(data) {
          alertMessage("command run successfully")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alertMessage(errorThrown+ " -display chosen? ")
        }
    })
}

function removeScreen(displayId, buttonElement){
    buttonElement.parentElement.parentElement.remove()
    json.rows = json.rows.filter(row=> row[1]!=displayId)
    loadTable("screens", json)
    $.ajax({
        url: 'kill',
        type: 'POST',
        data: {
            "id":displayId
        },
        success: function(data) {
          alertMessage("screen removed")
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alertMessage(errorThrown)
        }
    })
}

function getRow(row){
    return [getRadio(row.id), row.id, row.port, row.dsize, getUrlBlock(row.url), getremoveBlock(row.id)]
}

$(document).ready(function(){
    $.get("list", function(data){
        $("#dsize").val(data.dsize)
        if(data.list && data.list.length>0 ){
            json.rows = data.list.map(row => getRow(row))
            loadTable("screens", json)
        }
    })

    $("#commandButton").click(function(){
        let displayId = $("input[name='commandRadio']:checked"). val()
        runCommand(displayId)
    })

    $("#create-vnc").click(function(){
        $.post("create", {"dsize":$("#dsize").val()}, function(data){
            json.rows.push(getRow(data))
            loadTable("screens", json)
        })
    })

})