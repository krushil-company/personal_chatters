from odoo import models, fields

class MailMessageInherit(models.Model):
    _inherit = 'mail.message'

    page_key = fields.Char("Page Key")