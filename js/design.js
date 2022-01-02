// by Brian Yu - Harvard University

/* El 19 de septiembre del 2017 se le pidio permiso para usar su codigo.
  Mismo fue autorizado a Santos Lopez la fecha mencionado

*/
window.onload = function() {
    render();
}

var screenWidth;
var screenHeight;
var svg;

var mainBubble;
var mediumBubbles = [];
var smallBubbles = [];
var selectedIndex = -1;
var inMove = false;


var onHomeScreen = false;

// data for large links
var mediumBubbleData = [
    {
        'title': 'About',
        'external': 0,
        'toggle': '#acerca',
        'color': '#42aaf4',
    },
    {
        'title': 'Beyond',
        'external': 0,
        'toggle': '#beyond',
        'color': '#cc971e'
    },
    {
        'title': 'Courses',
        'external': 0,
        'toggle': '#cursos',
        'color': 'crimson'
    },
    {
        'title': 'Projects',
        'external': 0,
        'toggle': '#proyectos',
        'color': '#178c2b'
    }
];

// small links to appear below big circle
var smallBubbleData = [
    {
        'title': 'Github Profile',
        'img': "static/img/contact-github.png",
        'link': 'https://github.com/santoslopez'
    },
    {
        'title': 'Goodreads Profile',
        'img': "static/img/contact-goodreads.png",
        'link': 'https://www.goodreads.com/santoslopez'
    },
    {
        'title': 'Edx Account Santos Lopez',
        'img': "static/img/contact-edx.png",
        'link': 'https://profile.edx.org/u/santoslopez'
    },
    {
        'title': 'Scratch Profile',
        'img': "static/img/contact-scratch.png",
        'link': 'https://scratch.mit.edu/users/santoslopez/'
    },
    {
        'title': 'Curriculum Santos Lopez',
        'img': "static/img/curriculum.png",
        'link': 'static/curriculum/santoslopez.pdf'
    },
    {
        'title': 'Youtube Santos Lopez',
        'img': "static/img/contact-youtube.png",
        'link': "https://www.youtube.com/channel/UClB9ZMcf2fBwQeuLRFf_FpA"
    }

];



// starting point
function render() {

    // compute screen size and define canvas
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    var canvas = d3.select('#contents')
        .style('width', screenWidth);
    svg = canvas.append('svg')
        .attr('width', px(screenWidth))
        .attr('height', px(screenHeight));

    // create all sized bubbles
    generateBubbles();

    // wait briefly before entering home screen
    svg.transition().delay(100).on('end', homeScreen);
};


// generates a random point outside the bounds of the screen
function randomOutside() {
    var outsideX = Math.random() > 0.5; // away from x or y axis
    var direction = Math.random() > 0.5; // away from positive or negative end
    var distance = Math.floor((Math.random() * 100) + 100) + mainBubbleSize;
    var startLoc = Math.floor(Math.random() * (screenWidth + 100)) - 50;
    if (outsideX && direction)
        return [startLoc, -distance];
    else if (outsideX)
        return [startLoc, screenHeight + distance];
    else if (direction)
        return [screenWidth + distance, startLoc];
    else
        return [-distance, startLoc];
};

function generateBubbles() {

    // creates central image at a random location
    var loc = randomOutside();
    mainBubble = svg.append('image')
        .attr('xlink:href', "static/img/profile.png")
        .attr('x', loc[0])
        .attr('y', loc[1])
        .attr('width', mainBubbleSize)
        .attr('height', mainBubbleSize)
        .on('click', homeScreen);

    // creates each of the medium bubbles (without text) at a random location
    for (var i = 0; i < mediumBubbleData.length; i++) {
        var loc = randomOutside();
        var bubble = svg.append('circle')
            .attr('cx', loc[0])
            .attr('cy', loc[1])
            .attr('r', (mediumBubbleSize / 2))
            .attr('bubbleIndex', i)
            .attr('class', 'mediumBubble')
            .attr('external', mediumBubbleData[i]['external'])
            .attr('toggle', mediumBubbleData[i]['toggle'])
            .style('fill', mediumBubbleData[i]['color']);

        // add to our list of bubbles of this size
        mediumBubbles.push(bubble);

        // when clicked, either link somewhere else, or display page contents
        bubble.on('click', function() {
            if (d3.select(this).attr('external') == 1)
                window.open(d3.select(this).attr('toggle'), '_blank');
            else {
                bubbleClicked(
                        d3.select(this).attr('bubbleIndex'),
                        d3.select(this).attr('toggle'));
            }
        });
    }

    // create the small bubbles at random locations
    for (var i = 0; i < smallBubbleData.length; i++) {
        var loc = randomOutside();
        var img = svg.append('image')
            .attr('xlink:href', smallBubbleData[i]['img'])
            .attr('x', loc[0])
            .attr('y', loc[1])
            .attr('link', smallBubbleData[i]['link'])
            .attr('class', 'smallBubble')
            .attr('width', smallBubbleSize)
            .attr('height', smallBubbleSize);
        smallBubbles.push(img);

        // when small bubble clicked, link to its page
        img.on('click', function() {
            window.open(d3.select(this).attr('link'), '_blank');
        });
    }
};

// keep track of all the medium bubble labels
var labels = [];
function homeScreen() {

    // if already on home screen, do nothing
    if (onHomeScreen)
        return;
    onHomeScreen = true;

    // mark that objects are in transit, so user doesn't interrupt
    inMove = true;

    // -1 is selected index for the main screen
    selectedIndex = -1;

    // hide any sections that are currently visible
    d3.selectAll('.section').transition()
        .delay(transitionTime)
        .style('display', 'none');

    // move all objects into their correct locations
    mainBubble.transition()
        .duration(transitionTime)
        .attr('x', (screenWidth / 2) - (mainBubbleSize / 2))
        .attr('y', (screenHeight / 2) - (mainBubbleSize / 2))
        .attr('width', mainBubbleSize)
        .attr('height', mainBubbleSize);

    for (var i = 0; i < mediumBubbles.length; i++) {
        var bubble = mediumBubbles[i];
        var angle = (2 * i + 1) * (Math.PI / (2 * mediumBubbles.length + 1)) + Math.PI / 2 + (Math.PI / (4 * mediumBubbles.length + 1));
        var transition = bubble.transition()
            .duration(transitionTime)
            .attr('cx', (screenWidth / 2) - Math.sin(angle) * outerRadius)
            .attr('cy', (screenHeight / 2) + Math.cos(angle) * outerRadius)
            .attr('r', mediumBubbleSize / 2)
            .on('end', function() {
                animateMediumBubble(d3.select(this));
            });

        // if labels have yet to be generated, generate them; else, just move them into place
        if (labels.length !== mediumBubbleData.length) {
            var headline = svg.append('text')
                .attr('x', (screenWidth / 2) - Math.sin(angle) * outerRadius)
                .attr('y', (screenHeight / 2) + Math.cos(angle) * outerRadius - 5)
                .attr('class', 'mediumBubbleText')
                .style('font-family', lato)
                .style('font-weight', 'bold')
                .style('alignment-baseline', 'hanging')
                .style('text-anchor', 'middle')
                .style('font-size', headlineSize)
                .style('fill', '#000000')
                .style('pointer-events', 'none')
                .style('opacity', 0)
                .text(mediumBubbleData[i]['title']);
            labels.push(headline);

            headline.transition()
                .duration(transitionTime)
                .delay(transitionTime / 2)
                .style('opacity', 1);
         } else {
            labels[i].transition()
                .duration(transitionTime)
                .attr('x', (screenWidth / 2) - Math.sin(angle) * outerRadius)
                .attr('y', (screenHeight / 2) + Math.cos(angle) * outerRadius - 5)
                .style('font-size', headlineSize)
         }
    }

    for (var i = 0; i < smallBubbles.length; i++) {
        var img = smallBubbles[i];
        var angle = (2 * i + 1) * (Math.PI / (2 * smallBubbles.length + 1))
            - Math.PI / 2 + (Math.PI / (4 * smallBubbles.length + 1));
        var transition = img.transition()
            .duration(transitionTime)
            .attr('x', (screenWidth / 2) + Math.sin(angle) * innerRadius
                    - (smallBubbleSize / 2))
            .attr('y', (screenHeight / 2) + Math.cos(angle) * innerRadius
                    - (smallBubbleSize / 2))
            .on('end', function() {
                animateSmallBubble(d3.select(this));
            });
    }

    // make sure svg canvas is the proper height
    // and once everything is in place, make points grow on mouseover
    svg.transition()
        .duration(transitionTime)
        .attr('height', screenHeight)
        .on('end', animatePoints);
    animateMainBubble();
}

// create pulsing effect for a medium bubble
function animateMediumBubble(bubble) {
    function animate() {

         if (!onHomeScreen)
            return;

        bubble.transition()
            .duration(bubbleGrowTime)
            .ease(d3.easeQuad)
            .attr('r', (mediumBubbleSize / 2) * bubbleGrowRatio)
            .transition()
            .duration(bubbleGrowTime)
            .ease(d3.easeQuad)
            .attr('r', (mediumBubbleSize / 2))
            .on('end', animate);
    }
    animate();
}

// create a pulsing effect for a small bubble
function animateSmallBubble(bubble) {
    function animate() {
        bubble.transition()
            .duration(bubbleGrowTime)
            .ease(d3.easeQuad)
            .attr('width', smallBubbleSize * bubbleGrowRatio)
            .attr('height', smallBubbleSize * bubbleGrowRatio)
            .attr('transform', 'translate(' + (- ((bubbleGrowRatio - 1) * smallBubbleSize)/2) + ', ' + (- ((bubbleGrowRatio - 1) * smallBubbleSize)/2) + ')')
            .transition()
            .ease(d3.easeQuad)
            .attr('width', smallBubbleSize)
            .attr('height', smallBubbleSize)
            .attr('transform', '')
            .on('end', animate);
    }
    animate();
}

// grow upon hover
function animatePoints() {
    inMove = false; // will get here at end of home screen, done being in transit

    d3.selectAll('.mediumBubble').on('mouseover', function() {

        // if things are moving, or if this bubble is selected, do nothing
         if(inMove) return;
         if(selectedIndex == d3.select(this).attr('bubbleIndex')) return;

         // enlarge by a factor of its current size, where current size depends on the current screen
         var originalSize = onHomeScreen ? (mediumBubbleSize / 2) : (mediumBubbleSmallSize / 2);
        d3.select(this)
            .transition()
            .duration(hoverTime)
            .attr('r', originalSize * bubbleGrowRatioLarge);

         // grow the label
         if (onHomeScreen)
             labels[d3.select(this).attr('bubbleIndex')].transition()
                .duration(hoverTime)
                .style('opacity', 1)
                .style('font-size', headlineGrowSize);
    })
    .on('mouseout', function() {

        // if things are moving, or if this bubble is selected, do nothing
         if(inMove) return;
         if(selectedIndex == d3.select(this).attr('bubbleIndex')) return;
         var originalSize = onHomeScreen ? (mediumBubbleSize / 2) : (mediumBubbleSmallSize / 2);
        d3.select(this)
            .transition()
            .duration(hoverTime)
            .attr('r', originalSize)
         .on('end', function() {

             // after we've shrunk back down, start the pulsing again
            animateMediumBubble(d3.select(this));
         });

        // only if on the home screen, shrink the label
         if (onHomeScreen)
             labels[d3.select(this).attr('bubbleIndex')].transition()
                .duration(hoverTime)
                .style('font-size', headlineSize);
    });

    d3.selectAll('.smallBubble').on('mouseover', function() {
         if(inMove) return;
        d3.select(this).transition()
            .duration(hoverTime)
            .attr('width', smallBubbleSize * bubbleGrowRatioLarge)
            .attr('height', smallBubbleSize * bubbleGrowRatioLarge)
            .attr('transform', 'translate(' + (- ((bubbleGrowRatioLarge - 1) * smallBubbleSize)/2) + ', ' + (- ((bubbleGrowRatioLarge - 1) * smallBubbleSize)/2) + ')');
    })
    .on('mouseout', function() {
         if(inMove) return;
        d3.select(this).transition()
            .duration(hoverTime)
            .attr('width', smallBubbleSize)
            .attr('height', smallBubbleSize)
            .attr('transform', '')
            .on('end', animatePoints);
    });
}

// when a medium bubble is clicked, need to change the page
function bubbleClicked(index, toggle) {

    // mark flags to indicate change
    selectedIndex = index;
    inMove = true;
    onHomeScreen = false;

    // move the large bubble
    mainBubble.transition()
         .duration(transitionTime)
         .attr('x', 2 * padding)
         .attr('y', 2 * padding)
         .attr('width', mainBubbleSmallSize)
         .attr('height', mainBubbleSmallSize);

    // move the key medium bubble
    mediumBubbles[selectedIndex].transition()
        .duration(transitionTime)
        .attr('cx', 3 * padding + 3 * mainBubbleSmallSize / 2)
        .attr('cy', 2 * padding + mainBubbleSmallSize / 2)
        .attr('r', mainBubbleSmallSize / 2);

    // move the selected label
    labels[selectedIndex].transition()
         .duration(transitionTime)
         .attr('x', 3 * padding + 3 * mainBubbleSmallSize / 2)
         .attr('y', 2 * padding + mainBubbleSmallSize / 2 - 5)
         .style('font-size', headlineSizeSmall);

    // move the other medium bubbles and their labels
    var x = 4 * padding + 2 * mainBubbleSmallSize + mediumBubbleSmallSize / 2;
    var y = 2 * padding + mainBubbleSmallSize / 2;
    for (var i = 0; i < mediumBubbles.length; i++) {
        if (i == selectedIndex)
            continue;
        mediumBubbles[i].transition()
            .duration(transitionTime)
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', mediumBubbleSmallSize / 2);

        labels[i].transition()
            .duration(transitionTime)
            .attr('x', x)
            .attr('y', y - 5)
            .style('font-size', headlineSizeTiny);

        x += padding + mediumBubbleSmallSize;
    }

    // move the small bubbles
    var left = true; // put the bubble on left or right
    var height = padding;
    for (var i = 0; i < smallBubbles.length; i++) {
        var x = left ? screenWidth - 2 * padding - 2 * smallBubbleSize :
                screenWidth - padding - smallBubbleSize;
        var y = height;
        smallBubbles[i].transition()
            .duration(transitionTime)
            .attr('x', x)
            .attr('y', y);

        left = !left;
        if (left)
            height += padding + smallBubbleSize;
    }

    // actually manipulate the HTML now
    // start by hiding all sections
    d3.selectAll('.section').style('display', 'none');

    // now make the one we want visible
    d3.select(mediumBubbleData[index]['toggle']).style('display', 'inline');

    // shrink the svg canvas area, and then mark that things are done moving
    svg.transition()
        .duration(transitionTime)
        .attr('height', padding + (smallBubbleData.length / 2) * (smallBubbleSize + padding))
        .on('end', function() { inMove = false; });
}

// let the main button grow on mouseover if another page is selected
function animateMainBubble() {
    mainBubble.on('mouseover', function() {
         if (inMove) return;
         if (selectedIndex == -1) return;
         mainBubble.transition()
            .duration(hoverTime)
            .attr('x', padding)
            .attr('y', padding)
            .attr('width', mainBubbleSmallSize * bubbleGrowRatioMed)
            .attr('height', mainBubbleSmallSize * bubbleGrowRatioMed);
     })
     .on('mouseout', function() {
         if (inMove) return;
         if (selectedIndex == -1) return;
         var originalSize = onHomeScreen ? mainBubbleSize : mainBubbleSmallSize;
         mainBubble.transition()
            .duration(hoverTime)
            .attr('x', 2 * padding)
            .attr('y', 2 * padding)
            .attr('width', mainBubbleSmallSize)
            .attr('height', mainBubbleSmallSize);
     });
}

// helper functions
function px(x) {
    return x + 'px';
}

function pxtonum(x) {
    return parseInt(x.substring(0, x.length - 2));
}

// constants
var padding = 10;
var mainBubbleSize = 200;
var mediumBubbleSize = 120;
var smallBubbleSize = 40;
var outerRadius = 220;
var innerRadius = 150;
var headlineSize = 24;
var headlineGrowSize = 30;
var headlineSizeSmall = 20;
var headlineSizeTiny = 15;

var mainBubbleSmallSize = 100; // when on a page
var mediumBubbleSmallSize = 70; // when on page, not selected

var bubbleGrowRatio = 1.05;
var bubbleGrowRatioMed = 1.15;
var bubbleGrowRatioLarge = 1.3;

var hoverTime = 200;
var transitionTime = 1000;
var bubbleGrowTime = 1000;

 var merriweather = '"Merriweather", serif';
 var lato = '"Lato", sans-serif';