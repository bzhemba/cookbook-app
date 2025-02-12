const searchBtn = document.querySelector("#searchBtn");
const search_input = document.querySelector("#searchBox");
var substringMatcher = function (strs) {
    return function findMatches(q, cb) {
        var matches = [];
        var substrRegex = new RegExp(q, 'i');

        $.each(strs, function (i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};

var meals = [
    'Pasta',
    'Pizza',
    'Sushi',
    'Tacos',
    'Burger',
    'Salad',
    'Steak',
    'Curry',
    'Ice Cream',
    'Chocolate Cake',
    'Apple Pie',
    'Fried Rice',
    'Chicken Wings',
    'Fish and Chips',
    'Sandwich',
    'Quiche',
    'Lasagna',
    'Dumplings',
    'Spring Rolls',
    'Pancakes',
    'Waffles',
    'Chili',
    'Biryani',
    'Ramen',
    'Crepes',
    'Fajitas',
    'Paella',
    'Moussaka',
    'Goulash',
    'Ceviche',
    'Poutine'
];

$('#search .finder__input').typeahead({
        highlight: true,
        minLength: 1
    },
    {
        name: 'meals',
        source: substringMatcher(meals)
    });

searchBtn.addEventListener("click", (e) => {
    window.open( ` http://localhost:63343/untitled/pages/all-recipes.html?filter=${search_input.value.trim()}` )
});