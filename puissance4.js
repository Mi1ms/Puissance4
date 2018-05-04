(function($){
	
	$.fn.puissance4 = function(options){
		
		var optdef = {
			grille : {
				"case_x": 6,
				"case_y" : 7
			},
			
			nameplayer1 : 'player1', 
			colorplayer1 :  'red',			
			nameplayer2 : 'player2',
			colorplayer2 : 'blue', 
			ia : 'false'
					
		};
		
		var par = $.extend(optdef, options);

		return this.each(function(){
			getplay(this, par);
			sizegrid(par, this);
			$(this).append($('<div>', {
				id : "chip",
				style : " position: absolute; top : 5px; z-index: -0; width: 50px; height: 50px; border-radius : 100%; margin: 0px 3px; border : 1px outset;"
			}));
			// toolbtns(par, this);
			clickplayer(par, this);
		});
		
	};
})(jQuery);
function getplay(separate, par){
	// $("#chip").hide();
	$(separate).css("display", "flex");
	
	$(separate).append($('<div>', {
		class : "grille"
	}));
	$(separate).append($('<div>', {
		class : 'buttons',
		style : "border-radius : 5px; margin: 5px auto; padding: 6px; background: #40e0d0; box-shadow: 4px 3px grey; border: 1px solid; width: 450px; text-align: center;"
	}));
	$(".buttons").append($("<h5>Une petite partie</h5>"));

	$(".buttons").append($("<input id='last-move' type='hidden' data-move='empty'/>"));
	$(".buttons").append($("<input type='button' class='exit' onclick='deletedata()' value='annuler?'/>"));
	
	$("h5").css("font-size", "25px");
	$(".buttons").append("<h6>"+par['nameplayer1']+" : </h6>")
	$(".buttons").append("<h6>"+par['nameplayer2']+" : </h6>")
	
	$("#last-move").data("move", "empty");
}
function sizegrid(par, separate){
	$(separate).children('.grille').append($('<table>', {
		class : 'Arraytable',
		style : "background: green; "
	}));
	$(".Arraytable").val("true");
	for (var i = 1; i <= par['grille']['case_x']; i++){
		$(separate).children('.grille').children('.Arraytable').append($('<tr>'));
	}
	for(var a = 1; a <= par['grille']['case_y']; a++){
		$(separate).children('.grille').children('.Arraytable').children($('tbody')).children($('<tr>')).append($('<td>'));
		$($('td')).attr("style" , "border: 2px grey inset;width: 50px; height: 50px; border-radius: 100%; background: white; ");
		$("td").slice(0).val( "empty" );	
	}	
}
function toolbtns(par, separate){
	var nameone = $(separate).children('.buttons').append($('<input>', {
		class : 'nameone', 
		type : 'text', 
		placeholder : 'playerone'
	}));

	var colorone = $(separate).children('.buttons').append($('<input>', {
		class : 'colorone', 
		type : 'color'
	}));
	
	var nametwo = $(separate).children('.buttons').append($('<input>', {
		class : 'nametwo', 
		type : 'text', 
		placeholder : 'playertwo'
	}));
	var colortwo = $(separate).children('.buttons').append($('<input>', {
		class : 'colortwo', 
		type : 'color'
	}));
}
function clickplayer(par, separate){
	var b = 0;
	var a= 0;
	var td = $(separate).children('.grille').children('.Arraytable').children($('tbody')).children($('<tr>')).children($('<td>'));

	td.click( function(){
		if($(".Arraytable").val() == "true"){
			$('.exit')[0].value = 'annuler?';
			var x = $(this).parent().index();
			var y = $(this).index();
			var pos = $(this).offset();
			var pxleft = Math.ceil(pos.left);
			
			if(par['colorplayer1'] == par['colorplayer2']){
				par['colorplayer2'] = "#ffefcc";
			}
			if(b%2 == 0){ //tour du joueur  
				var color = par['colorplayer1'];
				name = par['nameplayer1'];
				otherplayer = par['nameplayer2'];
			}
			else{
				var color = par['colorplayer2'];
				name = par['nameplayer2'];
				otherplayer = par['nameplayer1'];
			}
			
			if($(this).val() == "empty"){
				var table = ($('tbody')).children($('<tr>'));
				var lenght = par['grille']['case_x'] - 1;

				for(var i = lenght; i >= x; i--) {
					var underneath = table[i].children[y];
					var above = table[a].children[y]; 
					// $(above).css("background", color);
					
					if(underneath.value == "empty"){					
						var undertop = $(underneath).offset();
						var pxtop = Math.ceil(undertop.top);

						//animate chip
						$("h5").text("C'est au tour de : "+otherplayer);
						
						$('#chip').animate({left: pxleft+"px"});
						$('#chip').show();
						$('#chip').animate({top: pxtop+"px"});
						
						var poschip = $("#chip").offset();
						
						$("#chip").css("background", color);
						
						$(underneath).css("background" , color);
						$(underneath).val(name);

						if(poschip.top !== 0){
							$('#chip').animate({left: "0px"});
							$('#chip').animate({top : "0px"});
							// $("#chip").hide();
						}
						datamove(underneath);
						winvertical(par, underneath, name);
						winhorizontal(par, underneath, name);
						windiagonal(par, underneath, name);
						b++; 
						break;
					}	
					// else{
					// 	$(above).css("background", "white");	
					// }
					// a++;		
				}	
			}	
		}
		else{
			$('#chip').hide();
			$('#chip').animate({left: "0px"});
			$('#chip').animate({top : "0px"});
			alert("That's all folks");
			var newgame = confirm("Encore ?")
			
			if(newgame === true){
				$("td").slice(0).val( "empty" );
				$("td").slice(0).css("background", "white");
				$(".Arraytable").val("true");	
			}
		}
	});	
}
function windiagonal(par, position, player){
	var vert = par['grille']['case_x']-1;
	var horiz = par['grille']['case_y']-1;
	var index = $(position).index();
	var Pindex = $(position).parent().index();
	var parent = ($('tbody')).children($('<tr>'));
	var arrayleft = [];
	var arrayright = [];
	var bottom = []
	var a = 0;
	var z = 0;
	var e = 0;

	for(var i = 0; i <= Pindex; Pindex--) {
		var nbr = vert - Pindex;
		var posright = parent[Pindex].children[index+z];
		var posleft = parent[Pindex].children[index-z];
		arrayright.push(posright);
		arrayleft.push(posleft);
		z++;
	}
	arrayright.reverse()
	arrayleft.reverse()
	var revindex = index; 
	Pindex = $(position).parent().index();
	for(var x= Pindex; vert >= x; x++){
		nbr = horiz - x;
		var pos = parent[x].children[index];
		var posleft = parent[x].children[revindex]; 
		if(x !== Pindex){
			arrayright.push(pos)
			arrayleft.push(posleft);
		}
		index--;
		revindex++;	
	}
	arrayright.reverse()
	arrayleft.reverse()
	while(a !== arrayright.length){
		var first = arrayright[a];
		var second = arrayright[a+1];
		var third = arrayright[a+2];
		var last = arrayright[a+3];
		
		if(first === undefined|| second === undefined || third === undefined || last === undefined){
			
		}
		else{
			if(first.value == player && second.value == player && third.value == player && last.value == player){
				alert("Nous avons un gagnant! Veuillez applaudir bien comme il se doit "+player);
				$(".Arraytable").val("false");

				if(player == par['nameplayer1']){
					
					$("h6:first").append("<i class='fa fa-thumbs-up'> </i> ");
					$("h6:last").append("<i class='fa fa-thumbs-o-down'> </i> ");
				}
				else{
					$("h6:last").append("<i class='fa fa-thumbs-up'> </i> ");
					$("h6:first").append("<i class='fa fa-thumbs-o-down'> </i> ");
				}
			}
		}	
		a++;
	}
	var q = 0;
	while(q !== arrayright.length){
		var first = arrayleft[q];
		var second = arrayleft[q+1];
		var third = arrayleft[q+2];
		var last = arrayleft[q+3];

		if(first === undefined|| second === undefined || third === undefined || last === undefined){
			
		}
		else{
			if(first.value == player && second.value == player && third.value == player && last.value == player){
				alert("Nous avons un gagnant! Veuillez applaudir bien comme il se doit "+player);
				$(".Arraytable").val("false");

				if(player == par['nameplayer1']){
					
					$("h6:first").append("<i class='fa fa-thumbs-up'> </i> ");
					$("h6:last").append("<i class='fa fa-thumbs-o-down'> </i> ");
				}
				else{
					$("h6:last").append("<i class='fa fa-thumbs-up'> </i> ");
					$("h6:first").append("<i class='fa fa-thumbs-o-down'> </i> ");
				}
			}
		}	
		q++;
	}
}
function winhorizontal(par, position, player){
	var hor = par['grille']['case_y']-1;
	var index = $(position).index();
	var Pindex = $(position).parent().index();
	var parent = ($('tbody')).children($('<tr>'));
	var array = [];
	var a = 0;
	
	for(var i = 0 ; i <= hor; hor--){
		var pos = parent[Pindex].children[hor];
		array.push(pos.value);		
	}
	while(a <= array.length) {
		if(array[a] == player && array[a+1] == player && array[a+2] == player && array[a+3] == player){
			alert("Nous avons un gagnant! Veuillez applaudir bien comme il se doit "+player);
			$(".Arraytable").val("false");
			if(player == par['nameplayer1']){
				
				$("h6:first").append("<i class='fa fa-thumbs-up'> </i> ");
				$("h6:last").append("<i class='fa fa-thumbs-o-down'> </i> ");
			}
			else{
				// win2++;
				$("h6:last").append("<i class='fa fa-thumbs-up'> </i> ");
				$("h6:first").append("<i class='fa fa-thumbs-o-down'> </i> ");
			}
		}
		a++;
	}
}
function winvertical(par, position, player){
	var height = par['grille']['case_x'] -1; // nbr de grille du tableau
	var index = $(position).index(); // index de la position du jeton
	var Pindex = $(position).parent().index(); // index parent
	var parent = ($('tbody')).children($('<tr>')); // path 
	var array = []; // array 
	
	for(var i = 0; i <= height; height--){
		var pos = parent[height].children[index];
		array.push(pos.value);			
	}
	var a = 0;
	while(a <= array.length) {
		if(array[a] == player && array[a+1] == player && array[a+2] == player && array[a+3] == player){
			alert("Nous avons un gagnant! Veuillez applaudir bien comme il se doit "+player);
			$(".Arraytable").val("false");

			if(player == par['nameplayer1']){
				
				$("h6:first").append("<i class='fa fa-thumbs-up'> </i> ");
				$("h6:last").append("<i class='fa fa-thumbs-o-down'> </i> ");
			}
			else{
				
				$("h6:last").append("<i class='fa fa-thumbs-up'> </i> ");
				$("h6:first").append("<i class='fa fa-thumbs-o-down'> </i> ");
			}
		}
		a++;
	}	
}
function datamove(position){
	historique = [];
	var last = $("#last-move").data("move", position);
	historique.push(last);
}
function deletedata(){
	var conf = confirm("Voulez vous vraiment annulez votre dernier coup ?");

	if(conf === true){
		var button = $(".exit").value
		var lastdata = $("#last-move").data("move");
		if(lastdata !== "empty" && button !== "change"){
			
			lastdata.style.background = "white";
			lastdata.value = "empty";
			$("#last-move").data("move", "empty");
			$(".exit")[0].value = "change";
		}
		else{
			alert("Tu dois d'abord placer ton jeton (T'es pas très fute-fute dis donc..)");
		}
	}
		
}