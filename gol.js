/*
 * =================
 * GAME OF LIFE
 * December of 2011
 * Roxanne Guo®
 * =================
 *
 * RULES OF LIFE
 * -------------
 * Any live cell with fewer than two live neighbours dies, as if caused by under-population.
 * Any live cell with two or three live neighbours lives on to the next generation.
 * Any live cell with more than three live neighbours dies, as if by overcrowding.
 * Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
 *
 * Email me at roxane.guo@gmail.com with suggestions/comments.
 */


var game_board = [];
var evolution_timer;
var count_down;


function oneOrZero() {
    return Math.round(Math.random());
}


// Create game board
Array.matrix = function(callback) {
    var array, x, y;
    for (x=0; x<25; x++) {
        array = [];
        for (y=0; y<25; y++) {
            if (typeof callback === "function") array[y] = callback();
            else array[y] = callback;
        }
        game_board[x] = array;
    }
}


function evolution() {
    var new_gen = JSON.parse(JSON.stringify(game_board));
    var x,y,i,j;

    // NOTE: we are using two for loops because for..in loop does not gurantee order 
    for (x=0; x<game_board.length; x++) { for (y=0; y<game_board[x].length; y++) {
        var live_neighbours = 0; var cell_status;
        if (game_board[x][y] == 1) cell_status = true;
        else cell_status = false;

        // Number of live neighbours
        for (i=x-1; i<x+2; i++) { 
            if (i<0 || i>=game_board.length) continue
            for (j=y-1; j<y+2; j++) {
                if (j<0 || j>=game_board[x].length || (i==x && j==y)) continue
                if (game_board[i][j] == 1) live_neighbours++;
            }
        }

        // Rules of life
        if (cell_status) {
            if (live_neighbours == 2 || live_neighbours == 3) new_gen[x][y] = 1;
            else new_gen[x][y] = 0;
        } else {
            if (live_neighbours == 3) new_gen[x][y] = 1;
        }
    }}
    game_board = JSON.parse(JSON.stringify(new_gen));
    print_board();
}


function print_board() {
    $("ul#game_board").empty();
    var x, y;
    // x -> row, y -> column
    for (x=0; x<game_board.length; x++) {
        for (y=0; y<game_board[x].length; y++) {
            var cell_position = x + '-' + y; 
            if (game_board[x][y] == 1) var class_name = 'live';
            else var class_name = 'dead';
            jQuery('<li/>', {
                id: cell_position,
                class: class_name
            }).appendTo('ul#game_board');
        }
    } 
}


function countdown() {
    Array.matrix(0);
    count_down = 3;
    // if count = 3 then print 3
    //
    // else if count = 2 then print 2 
    //
    // else if count = 1 then print 1
    //
    // count --;
}


function start() {
    $("div#start").hide(); $("div#game").show();
    //Array.matrix(function(){return Math.round(Math.random());});
    print_board();
    evolution_timer = setInterval(function(){$("button#evolution").click();}, 350);
}


$(document).ready(function() {
    //once the button is clicked, the setinterval should only execute ONCE
    $("button#start_button").click(function() {
        if (count_down > 0) countdown();
        else clearTimeout(count_down_interval); 
        var count_down_interval = setInterval(function(){this.click();}, 500);
    });
    $("button#restart").click(function() {
        if (evolution_timer) {
            clearTimeout(evolution_timer);
            $("button#start_button").click();
        }
    });
    $("button#evolution").click(evolution);
});
