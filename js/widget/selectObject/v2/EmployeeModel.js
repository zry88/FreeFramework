/**
 * Employee Model
 */
define([
    "baseApp_2015/model/RemoteModel"
], function(RemoteModel) {
    var Model = RemoteModel.extend({
        idAttribute: 'employee_id',
        defaults: {
            "employee_id": "",
            "company_id": "",
            "department_id": "",
            "position_id": "",
            "employee_name": "",
            "employee_sex": "",
            "employee_birthdate": null,
            "employee_nationality": null,
            "employee_code": "",
            "employee_polit": null,
            "employee_martial_status": null,
            "employee_avatar": null,
            "employee_hiredate": "",
            "employee_firedate": null,
            "employee_cellphone": "",
            "employee_email": null,
            "employee_qq": null,
            "employee_phone_number": null,
            "employee_probation": null,
            "insurance_tpl": "",
            "insurance_company": null,
            "salary_tpl": "",
            "attendance_tpl": "",
            "employee_password": "",
            "employee_idcard_type": null,
            "employee_idcard_code": null,
            "employee_idcard_office": null,
            "employee_idcard_expire": null,
            "employee_idcard_address": null,
            "employee_birthplace": null,
            "employee_address": null,
            "employee_current_status": "",
            "employee_level": null,
            "contract_effecitve_date": null,
            "contract_expiry_date": null,
            "contract_expiry_times": null,
            "employee_probation_start": null,
            "employee_probation_end": null,
            "employee_order": null,
            "dep_name": null,
            "pos_name": null,
            "education_id": null,
            "education_type": null,
            "education_subject": null,
            "education_record": null,
            "education_dirving_licence": null,
            "employee_title": null,
            "education_language_type": null,
            "education_language_level": null,
            "salary_tpl_value": "",
            "salary_tpl_from": "",
            "insurance_tpl_value": "",
            "insurance_tpl_from": "",
            "attendance_tpl_value": "",
            "attendance_tpl_from": ""
        },
        initialize: function(options){
            var config = _.extend(options || {}, {
                apiUrl:{
                    create: '/employee/create', 
                    remove: '/employee/delete/',
                },
                option: {}
            });
            RemoteModel.prototype.initialize.call(this, config);
        },
    });
    return Model;
});