import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

    constructor() { }

    // ngAfterViewInit() {  //OLD SCHOOL way of doing it, without Angualar
    //     var btnUpArrow = document.getElementById('upArrowButton');
    //     if (btnUpArrow) {
    //         btnUpArrow.addEventListener('click', function () {
    //             window.scroll({
    //                 top: 0,
    //                 left: 0,
    //                 behavior: 'smooth'
    //             });
    //         });
    //     }
    // }

    ngAfterViewInit() {}

    upArrowButton_click(){
        console.log('inside upArrowButton_click');
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    //toggleFooter(e) {
    //    if (isMobile()) {
    //        e.preventDefault();
    //        e.stopImmediatePropagation();
    //    }
    //}

    ngOnInit() { }
}
