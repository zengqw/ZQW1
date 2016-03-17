/**
 * Created by wjjn3481 on 2016/1/15.
 */
define(["common/validatorHelper"], function (ValidatorHelper) {
    return {
        validatorFunc: {
            name: {
                validator: [ValidatorHelper.isNotEmpty]
            }
        }
    }
});