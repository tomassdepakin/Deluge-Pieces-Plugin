/*
Script: pieces.js
    The client-side javascript code for the Pieces plugin.

Copyright:
    (C) Nick Lanham 2009 <nick@afternight.org>
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 3, or (at your option)
    any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, write to:
        The Free Software Foundation, Inc.,
        51 Franklin Street, Fifth Floor
        Boston, MA  02110-1301, USA.

    In addition, as a special exception, the copyright holders give
    permission to link the code of portions of this program with the OpenSSL
    library.
    You must obey the GNU General Public License in all respects for all of
    the code used other than OpenSSL. If you modify file(s) with this
    exception, you may extend this exception to your version of the file(s),
    but you are not obligated to do so. If you do not wish to do so, delete
    this exception statement from your version. If you delete this exception
    statement from all source files in the program, then also delete it here.
*/

Ext.namespace('Deluge.pieces');
var dh = Ext.DomHelper;

Deluge.pieces.PiecesTab = Ext.extend(Ext.Panel, {
        title: _('Pieces'),
        autoScroll: true,

        constructor: function() {
            Deluge.pieces.PiecesTab.superclass.constructor.call(this);
            this.pieceSize = 10;
            this.pieceMargin = 3;
            this.updateConfig();
            this.curTorrent = null;
            this.lastDone = false;
            this.canvasBox = this.add({
                    xtype: 'box',
                    autoEl: {
                        tag: 'canvas',
                        id: 'pieces_canvas',
                    }
                });
            this.needRebuild = true;
        },
        
        updateConfig: function() {
            deluge.client.pieces.get_config({
                    success: function(config) {
                        var ctmp = config['dling_color'].split("");
                        this.dlingColor = "#"+ctmp[1]+ctmp[2]+ctmp[3]+ctmp[4]+ctmp[5]+ctmp[6];
                        ctmp = config['dled_color'].split("");
                        this.dledColor = "#"+ctmp[1]+ctmp[2]+ctmp[3]+ctmp[4]+ctmp[5]+ctmp[6];
                        ctmp = config['not_dled_color'].split("");
                        this.notDledColor = "#"+ctmp[1]+ctmp[2]+ctmp[3]+ctmp[4]+ctmp[5]+ctmp[6];
                        this.pieceSize = parseInt(config['square_size'], 10);
                        this.pieceMargin = parseInt(config['square_border_size'], 10);
                    },
                    scope: this
                });
        },
 

        buildCanvas: function(numPieces, done, pieces, curdl) {
            var canvas = this.getCanvas();
            var ctx = canvas.getContext('2d');

            var width = this.getInnerWidth() - Ext.getScrollBarWidth();
            
            canvas.width = width;
            var pieces_per_row = Math.floor(width / (this.pieceMargin + this.pieceSize));
            var rows = Math.floor(numPieces / pieces_per_row);
            canvas.height = this.pieceMargin + (rows + 1) * (this.pieceSize + this.pieceMargin);

            // Draw full rows
            for (var row=0; row<rows; ++row) {
                this.drawRow(ctx, row, pieces_per_row, pieces_per_row, pieces, curdl);
            }
            
            // Last row with leftovers
            this.drawRow(ctx, rows, numPieces % pieces_per_row, pieces_per_row, pieces, curdl);
        },

        drawRow: function(ctx, row, pieces, pieces_per_row, piecesStatus, currentlyDownloading) {
            var y = this.pieceMargin + row * (this.pieceSize + this.pieceMargin);
            for (piece=0; piece<pieces; ++piece) {
                var x = this.pieceMargin + piece * (this.pieceSize + this.pieceMargin);
                var pieceNum = this.getPieceNum(row, piece, pieces_per_row);
                var color = piecesStatus[pieceNum] ? this.dledColor : 
                            currentlyDownloading.indexOf(pieceNum) >= 0 ? this.dlingColor :
                            this.notDledColor;
                this.drawPiece(ctx, x, y, color);
            }
        },

        getPieceNum: function(currentRow, currentPiece, piecesPerRow) {
            return currentRow*piecesPerRow + currentPiece;
        },

        drawPiece: function(ctx, x, y, color) {
            ctx.fillStyle = color;
            ctx.fillRect(x, y, this.pieceSize, this.pieceSize);
        },

        getCanvas: function() {
            return document.getElementById('pieces_canvas');
        },

        onTorrentInfo: function(info) {
            if (this.needRebuild) {
                this.buildCanvas(info[1],info[0],info[2],info[3]); 
                this.needRebuild = false;
                this.lastDone = info[0];
            } else {
                if (!this.lastDone)
                    this.buildCanvas(info[1],info[0],info[2],info[3]); 
                this.lastDone = info[0];
            }
        },

        clear: function() {
            this.needRebuild = true;
        },

        update: function(torrentId) {
            if (torrentId != this.curTorrent) {
                this.needRebuild = true;
                this.curTorrent = torrentId;
            }
            deluge.client.pieces.get_torrent_info(torrentId, {
                    success: this.onTorrentInfo,
                    scope: this,
                    torrentId: torrentId
                });
        }
        
});

Deluge.pieces.PiecesPlugin = Ext.extend(Deluge.Plugin, {
        name:"Pieces",

        onEnable: function() {
            this.piecesTab = new Deluge.pieces.PiecesTab();
            deluge.details.add(this.piecesTab);
        },

        onDisable: function() {
            deluge.details.remove(this.piecesTab);
            this.piecesTab.destroy();
        }

});
Deluge.registerPlugin('Pieces',Deluge.pieces.PiecesPlugin);
