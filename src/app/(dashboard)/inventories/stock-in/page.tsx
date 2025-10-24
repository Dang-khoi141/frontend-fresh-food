'use client';

import React from 'react';
import { Wrench } from 'lucide-react';

export default function StockInPage() {
    return (
        <div
            style={{
                background: 'white',
                borderRadius: '12px',
                padding: '60px 40px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
            }}
        >
            <div
                style={{
                    display: 'inline-flex',
                    padding: '20px',
                    background: '#f0fdf4',
                    borderRadius: '50%',
                    marginBottom: '20px',
                }}
            >
                <Wrench size={48} style={{ color: '#059669' }} />
            </div>
            <h2
                style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '12px',
                }}
            >
                Chức năng đang được phát triển
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
                Tính năng Nhập hàng đang trong quá trình phát triển và sẽ sớm có mặt.
            </p>
        </div>
    );
}
