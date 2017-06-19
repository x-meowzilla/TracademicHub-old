$(function() {

    // Bar Chart
    Morris.Bar({
        element: 'statesBar',
        data: [{
            category: 'Experience Points',
            points: 24
        }, {
            category: 'Teaching Points',
            points: 43
        }, {
            category: 'Challenge Points',
            points: 25
        }, {
            category: 'Total Points',
            points: 30
        }, {
            category: 'LeaderBoard Rank',
            points: 5
        }],
        xkey: 'category',
        ykeys: ['points'],
        labels: ['Points'],
        barSizeRatio:0.35,
        hideHover: 'auto',
        resize: true
    });


});
