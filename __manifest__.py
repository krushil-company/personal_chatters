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
            'chatters/static/src/js/one2many_chatter.js',
            'chatters/static/src/xml/one2many_chatter.xml',
        ],
    },
    # 'assets': {
    #     'web.assets_backend': [
    #         'chatters/static/src/components/page_chatter_container.js',
    #         'chatters/static/src/page_chatter_container.xml',
    #         'chatters/static/src/form_controller_patch.js',
    #     ],
    # },
    'installable': True,
    'auto_install': True,
    'application': True
}
