var waterFall = {
    container: document.getElementById("container"),

    columnWidth: 400, // the column number is based on this value
    columnInitNum: 5, // number of images inited in each column

    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
    detectLeft: 0,
    sensitivity: 50,

    appendByColumn: function() {
        var i = 0;
        for (i = 0; i < this.columnNumber; i++) {
            var c = document.getElementById("column_" + i);
            if (c && !this.loadFinish) {
                if (c.offsetTop + c.clientHeight <
                    this.scrollTop + (window.innerHeight || document.documentElement.clientHeight)) {
                    this.append(c);
                }
            }
        }
        return this;
    },

    append: function(column) {
        crt_index = this.index_list[this.index]
        url_img = this.data[crt_index]['url_img'];
        url_paper = this.data[crt_index]['url_paper'];
        url_src = this.data[crt_index]['url_src'];
        url_project = this.data[crt_index]['url_project'];
        title = this.data[crt_index]['title'];

        var e = document.createElement("div");
        e.className = "unit";
        e.innerHTML = '<img src="'+ url_img +'" />'
        if (url_paper != '#') {
        e.innerHTML += '<a href="'+ url_project + '" target="_blank" ><strong>'+ title +'</strong></a>';}
        else {
            e.innerHTML += '<strong>'+ title +'</strong>';
        }

        if (url_paper != '#') {
            e.innerHTML += '<table align="center" cellspacing="0" cellpadding="5"><tr>'
                    + '<td><span class=" block-text"> <a href="'+ url_src +'" target="_blank">PPT Source</a></span></td>'
                    + '<td><span class=" block-text"> <a href="'+ url_paper +'" target="_blank">Paper</a></span></td>'
                    + '</tr></table>';
                }
        else {
            e.innerHTML += '<table align="center" cellspacing="0" cellpadding="5"><tr>'
                    + '<td><span class=" block-text"> <a href="'+ url_src +'" target="_blank">PPT Source</a></span></td>'
                    + '</tr></table>';
        }

        column.appendChild(e);

        this.index += 1;
        if (this.index >= this.data.length) {
            this.loadFinish = true;
        }
        return this;
    },

    create: function() {
        this.loadFinish = false;
        this.index = 0;
        keep_num = 2;  // keep first N figures fixed
        index_list = [...Array(this.data.length).keys()];
        for (j=0;j<keep_num;j++){
            index_list.shift()
        }
        this.index_list = this.shuffleArray(index_list);
        for (j=keep_num-1;j>=0;j--){
            this.index_list.unshift(j)
        }
        this.columnNumber = Math.floor(document.body.clientWidth / this.columnWidth);

        var i = 0, html = ''
        for (i = 0; i < this.columnNumber; i++) {
            html += '<span id="column_'+ i +'" class="column" style="width:'+ this.columnWidth +'px;"></span>';
        }
        html += '<span id="detect" class="column" style="width:'+ this.columnWidth +'px;"></span>';

        this.container.innerHTML = html;

        this.detectLeft = document.getElementById("detect").offsetLeft;
        for (i = 0; i < this.columnInitNum; i++) {
            this.appendByColumn();
        }
        return this;
    },

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    shuffleArray: function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    },

    scroll: function() {
        var self = this;
        window.onscroll = function() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (!this.loadFinish && Math.abs(scrollTop - self.scrollTop) > self.sensitivity) {
                self.scrollTop = scrollTop;
                self.appendByColumn();
            }
        };
        return this;
    },

    resize: function() {
        var self = this;
        window.onresize = function() {
            var eleDetect = document.getElementById("detect");
            var detectLeft = eleDetect && eleDetect.offsetLeft;
            if (detectLeft && Math.abs(detectLeft - self.detectLeft) > self.sensitivity) {
                this.columnInitNum = Math.floor(this.index / this.columnNumber);
                self.create(); // refresh the layout
            }
        };
        return this;
    },

    init: function(data) {
        if (this.container) {
            this.data = data;
            this.create().scroll().resize();
        }
    }
};
