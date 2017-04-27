var util = {

    random: function (min, max) {
        return min + Math.floor(Math.random() * (max - min + 1))
    },

    randomColor: function () {
        return ['#22CAB3', '#90CABE', '#A6EFE8', '#C0E9ED', '#C0E9ED', '#DBD4B7', '#D4B879', '#ECCEB2', '#F2ADA6', '#FF7784'][util.random(0, 9)];
        // return '#'+(Math.random()*0xffffff<<0).toString(16);
    },

    map: function (value, start, end, valueStart, valueEnd) {

        return valueStart + (valueEnd - valueStart) * value / (end - start)
    },

    randomSpeed: function () {
        return (Math.random() > 0.5 ? 1 : -1) * Math.random() * 2
    }

}

export  default  util