#
# colors.py
#
# Copyright (C) 2009 Nick Lanham <nick@afternight.org>
#
# Basic plugin template created by:
# Copyright (C) 2008 Martijn Voncken <mvoncken@gmail.com>
# Copyright (C) 2007-2009 Andrew Resch <andrewresch@gmail.com>
# Copyright (C) 2009 Damien Churchill <damoxc@gmail.com>
#
# Deluge is free software.
#
# You may redistribute it and/or modify it under the terms of the
# GNU General Public License, as published by the Free Software
# Foundation; either version 3 of the License, or (at your option)
# any later version.
#
# deluge is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
# See the GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with deluge.    If not, write to:
# 	The Free Software Foundation, Inc.,
# 	51 Franklin Street, Fifth Floor
# 	Boston, MA  02110-1301, USA.
#
#    In addition, as a special exception, the copyright holders give
#    permission to link the code of portions of this program with the OpenSSL
#    library.
#    You must obey the GNU General Public License in all respects for all of
#    the code used other than OpenSSL. If you modify file(s) with this
#    exception, you may extend this exception to your version of the file(s),
#    but you are not obligated to do so. If you do not wish to do so, delete
#    this exception statement from your version. If you delete this exception
#    statement from all source files in the program, then also delete it here.
#

from .color import Color


class Colors:

    def __init__(self, config):
        self.config = config

        self.not_downloaded_color = Color(config['not_dled_color'])
        self.downloaded_color = Color(config['dled_color'])
        self.downloading_color = Color(config['dling_color'])
        self.hover_border = Color(config['hover_border'])
        self.selected_border = Color(config['selected_border'])

    def get_not_downloaded_color(self):
        return self.not_downloaded_color

    def get_downloaded_color(self):
        return self.downloaded_color

    def get_downloading_color(self):
        return self.downloading_color

    def get_hover_border(self):
        return self.hover_border

    def get_selected_border(self):
        return self.selected_border
