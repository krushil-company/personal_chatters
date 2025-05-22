# -*- coding: utf-8 -*-
{
    'name': 'Personal Chatter',
    'version': '18.0.0.0.1',
    'license': 'LGPL-3',
    'depends': [
        'base',
        'mail',
        'web',
        'contacts',
        'sale_management',
        'website',
    ],
    'data': [
        # 'security/ir.model.access.csv',
        'views/sale_order_line_chatter_views.xml',
    ],
    'assets': {
        'web.assets_backend': [
            'chatters/static/src/js/personal_chatter.js',
            'chatters/static/src/xml/personal_chatter.xml',
            'chatters/static/src/js/one2many_chatter.js',
            'chatters/static/src/xml/one2many_chatter.xml',
        ],
    },
    "qweb": [
        "static/src/xml/personal_chatter.xml",
    ],
    'installable': True,
    'auto_install': True,
    'application': True
}
