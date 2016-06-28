define([
    'lib2/core/view/Layout',
], function(LayoutView) {
    var View = LayoutView.extend({
        initialize: function(option) {
            Hby.Events.off(null, null, this);
            var defaults = {
                options: {
                    style: {
                        marginTop: '20px',
                        // width: '1024px',
                        // marginRight: 0
                    },
                    // guide: {
                    //     steps: [{
                    //         images: [{
                    //             src: '1.png',
                    //             style: {
                    //                 top: '100px',
                    //                 left: '100px'
                    //             }
                    //         }, {
                    //             src: '4.png',
                    //             style: {
                    //                 top: '250px',
                    //                 right: '20px'
                    //             }
                    //         }],
                    //         buttons: {
                    //             next: {
                    //                 src: 'ok.png',
                    //             },
                    //         }
                    //     }, {
                    //         images: [{
                    //             src: '1.png',
                    //             style: {
                    //                 top: '200px',
                    //                 left: '100px'
                    //             }
                    //         }],
                    //         buttons: {
                    //             skip: {
                    //                 src: 'ok.png',
                    //             }
                    //         }
                    //     }]
                    // },
                    layout: {
                        rows: [{
                            // className: 'aa',
                            style: {},
                            cols: [{
                                // className: '',
                                style: {
                                    // background: '#f00',
                                }
                            }, {
                                style: {
                                    // background: 'blue',
                                }
                            }]
                        }, {
                            style: {},
                            cols: [{
                                className: 'col-md-3',
                                style: {
                                    // height: 100,
                                }
                            }, {
                                className: 'col-md-6',
                                style: {
                                    // height: 100,
                                }
                            }, {
                                className: 'col-md-3',
                                style: {
                                    // height: 100,
                                }
                            }]
                        }]
                    },
                    widgets: [{
                        key: 'panel_1',
                        src: 'widget2/test/app2',
                        name: 'test2',
                        target: 'row_0-col_0',
                        binds: {
                            'triggerEvent': 'onEvent',
                            'triggerEvent2': 'onEvent2',
                        },
                        options: {
                            className: 'panel panel-info'
                        }
                    }, {
                        key: 'panel_2',
                        src: 'widget2/test/app',
                        name: 'test',
                        target: 'row_0-col_1',
                        binds: {
                            'triggerEvent': 'onEvent3',
                            'triggerEvent2': 'onEvent4',
                        },
                        options: {
                            className: 'panel panel-danger'
                        }
                    }, {
                        key: 'panel1',
                        src: 'widget2/test/app',
                        name: 'test',
                        target: 'row_1-col_0',
                        binds: {
                            'triggerEvent': 'onEvent5',
                            'triggerEvent2': 'onEvent6',
                        },
                        // options: {}
                    }, {
                        key: 'panel2',
                        src: 'widget2/test/app',
                        name: 'test',
                        target: 'row_1-col_1',
                        binds: {
                            'triggerEvent': 'onEvent7',
                            'triggerEvent2': 'onEvent8',
                        },
                    }, {
                        key: 'panel3',
                        src: 'widget2/test/app',
                        name: 'test',
                        target: 'row_1-col_2',
                        binds: {
                            'triggerEvent': 'onEvent9',
                            'triggerEvent2': 'onEvent10',
                        },
                    }]
                }
            };
            if (option) $.extend(true, defaults, option || {});
            this.parent(defaults);
        },
        demo_triggerEvent: function(data) {
            data.num = 100;
            this.trigger();
        }
    });
    return View;
});
