define([
    'jquery',
    'underscore',
    'view/error'
], function($, _, WorkloadHome) {
    return function(type, page, key) {
        var view = this;
        var $workloadView = view.$('div.workload-view');

        var workloadHome = new WorkloadHome({
            el: $workloadView.get(0)
        });
    };
});