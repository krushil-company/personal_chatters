from odoo import models, fields

class SaleOrderInherit(models.Model):
    _inherit = ['res.partner']
    # 'mail.thread', 'mail.activity.mixin',

    xyz = fields.Char()