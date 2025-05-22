from odoo import models, fields

class SaleOrderInherit(models.Model):
    _inherit = ['res.partner']
    # 'mail.thread', 'mail.activity.mixin',

    xyz = fields.Char()




# class MailMessageInherit(models.Model):
#     _inherit = "mail.message"

#     def custom_method(self, model_name ,record_id, all_data):
#         print('\n\n*********************', self)
#         print('\n\n*********************', model_name)
#         print('\n\n*********************', record_id)
#         print('\n\n*********************', all_data)