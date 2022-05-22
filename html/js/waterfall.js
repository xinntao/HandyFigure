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
        url_img = this.data[this.index]['url_img'];
        url_paper = this.data[this.index]['url_paper'];
        url_src = this.data[this.index]['url_src'];
        url_project = this.data[this.index]['url_project'];
        title = this.data[this.index]['title'];

        var e = document.createElement("div");
        e.className = "unit";
        e.innerHTML = '<img src="'+ url_img +'" />'
        e.innerHTML += '<a href="'+ url_project + '"><strong>'+ title +'</strong></a>';
        e.innerHTML += '<table align="center" cellspacing="0" cellpadding="5"><tr>'
                    + '<td><span class=" block-text"> <a href="'+ url_src +'">PPT Source</a></span></td>'
                    + '<td><span class=" block-text"> <a href="'+ url_paper +'">Paper</a></span></td>'
                    + '</tr></table>';
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
