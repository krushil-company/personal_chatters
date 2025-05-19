# -*- coding: utf-8 -*-
{
    'name': 'Personal Chatter',
    'version': '18.0.0.0.1',
    'license': 'LGPL-3',
    'depends': [
        'base',
        'contacts',
        'sale_management',
        'mail',
    ],
    'data': [
        # 'security/ir.model.access.csv',
        # 'views/sale_order_inherit.xml',
        'views/sale_order_line_view.xml',
    ],
    'installable': True,
    'auto_install': True,
    'application': True
}
