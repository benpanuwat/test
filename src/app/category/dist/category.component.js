"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CategoryComponent = void 0;
var core_1 = require("@angular/core");
var CategoryComponent = /** @class */ (function () {
    function CategoryComponent(http, service) {
        this.http = http;
        this.service = service;
        this.category = [{
                id: '',
                name: '',
                url: ''
            }];
        this.products = [{
                id: '',
                name: '',
                url: '',
                path: '',
                discount: ''
            }];
        this.page = {
            page_count: 0,
            page_current: 1,
            page_button: [],
            page_button_min: 0,
            page_button_max: 0,
            page_button_prev: false,
            page_button_last: false
        };
        this.filter = {
            category_id: '',
            length: 1,
            search: '',
            start: 0
        };
    }
    CategoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.http.post(this.service.url + '/api/get_category', this.filter, {}).subscribe(function (res) {
            if (res.status) {
                _this.category = res.data;
            }
        });
        this.loadProduct();
    };
    CategoryComponent.prototype.loadProduct = function () {
        var _this = this;
        this.filter.start = this.page.page_current - 1;
        this.http.post(this.service.url + '/api/get_product_page', this.filter, {}).subscribe(function (res) {
            _this.products = res.data;
            var that = _this;
            _this.products.forEach(function (value) {
                value.path = that.service.url + "/" + value.path;
                value.url = btoa(value.product_id);
            });
            _this.page.page_button = [];
            _this.page.page_count = res.last_page;
            _this.page.page_button_min = _this.page.page_current - 2;
            _this.page.page_button_max = _this.page.page_current + 2;
            for (var i = _this.page.page_button_min; i <= _this.page.page_button_max; i++) {
                if (i >= 1 && i <= _this.page.page_count)
                    _this.page.page_button.push(i);
            }
            if (_this.page.page_current > 3)
                _this.page.page_button_prev = true;
            if (_this.page.page_current < _this.page.page_current - 2)
                _this.page.page_button_last = true;
        });
    };
    CategoryComponent.prototype.clickCategory = function (cat) {
        this.filter.category_id = cat.id;
    };
    CategoryComponent.prototype.clickPage = function (but) {
        this.page.page_current = but;
        this.loadProduct();
    };
    CategoryComponent = __decorate([
        core_1.Component({
            selector: 'app-category',
            templateUrl: './category.component.html',
            styleUrls: ['./category.component.css']
        })
    ], CategoryComponent);
    return CategoryComponent;
}());
exports.CategoryComponent = CategoryComponent;
