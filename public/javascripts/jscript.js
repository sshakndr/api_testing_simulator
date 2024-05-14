var authKey;

if (typeof jQuery != "undefined") {
    jq = jQuery.noConflict();

    jq(document).ready(function(){
        let key = localStorage.getItem("authKey");
        if (!key) {
            key = Date.now() + "" + Math.random();
            localStorage.setItem("authKey", key);
        }
        authKey = key;
    });

    jq(document).on("click","#apiRoute",function(){
        const currentElement = jq(this);
        let showid = currentElement.attr("name");
        
        jq("#apiRoute:not(.closed)").addClass("closed");
        jq(this).removeClass("closed");
        jq("img").removeClass("rotated");
        jq(this).children("img").addClass("rotated");
        jq(".info").removeClass("visible");
        jq(`#${showid}`).addClass("visible");
    });

    jq(document).on("click","#apiRoute:not(.closed)",function(){
        const currentElement = jq(this);
        let showid = currentElement.attr("name");

        jq(this).addClass("closed");
        jq(this).children("img").removeClass("rotated");
        jq(`#${showid}`).removeClass("visible");
    });

    jq(document).on("click","#changeErrors",function(){
        const currentElement = jq(this);
        let changeTo = currentElement.text();
        if (changeTo === "show errors") {
            jq("#Documentation").addClass("disabled");
            jq("#Errors").removeClass("disabled");
            jq(this).text("show documentation");
            jq("#DocumentationBlock").addClass("disabled");
            jq("#ErrorsBlock").removeClass("disabled");
            jq("div[name='docroutes']").addClass("nodisplay");
            jq("div[name='errs']").removeClass("nodisplay");
            jq("#author").text("also by sshakndr...");
        } else {
            jq("#Documentation").removeClass("disabled");
            jq("#Errors").addClass("disabled");
            jq(this).text("show errors");
            jq("#DocumentationBlock").removeClass("disabled");
            jq("#ErrorsBlock").addClass("disabled");
            jq("div[name='docroutes']").removeClass("nodisplay");
            jq("div[name='errs']").addClass("nodisplay");
            jq("#author").text("by sshakndr");
        }
    });

    jq(document).on("click","#requestButton",function(){
        jq("#responseStatus").text('');
        jq("#responseStatus").removeClass("not");
        jq("#statusLine").text("");
        jq("#responseBody").text('');
        jq("#sendButton").removeClass("disabled");
        var route = jq(this).children("div").eq(0).text().replaceAll(":id","0");
        if (!route.includes("0") && jq(this).children("b").eq(0).text() == "GET") route += "?page=1&pagination=10";
        var body = jq(this).attr("data-body");
        body = body == "" ? {} : JSON.parse(body);
        jq("div[id='requestButton']").removeClass("active");
        jq(this).addClass("active");
        jq("#requestInput").val(route);
        jq("#requestInput").attr("placeholder",jq(this).children("b").eq(0).text());
        jq("#bodyArea").val(Object.keys(body).length!==0?JSON.stringify(body,null,'  '):"");
        jq("#sendButton").removeClass("GET POST PUT DELETE").addClass( jq("#requestInput").attr("placeholder"));
    });

    jq(document).on("click","#sendButton:not(.disabled)",async function(){
        jq("#sendButton").addClass("disabled");
        let request = await fetch(window.location.origin + jq("#requestInput").val(),{
            method: jq("#requestInput").attr("placeholder"),
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': authKey,
            },
            body: jq("#bodyArea").val()?jq("#bodyArea").val():null
        });
        let response = await request.text();
        try{
            jq("#responseBody").text(JSON.stringify(JSON.parse(response),null,'  '));
        }catch{
            jq("#responseBody").text(response);
        }
        jq("#statusLine").text("Status: ");
        jq("#responseStatus").addClass(request.status.toString()[0]=="2"?'':'not');
        jq("#responseStatus").text(request.status);
        jq("#sendButton").removeClass("disabled");
    });
}