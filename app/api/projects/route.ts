import { NextResponse } from 'next/server';

// Temporary In-Memory Store during Vercel deployment since SQLite won't persist across Serverless Functions easily without external hosting
let projects = [
    {
        id: 1,
        title: "Aura Component Library",
        description: "A comprehensive UI kit for modern web applications.",
        image_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Skidive Cloud Dashboard",
        description: "Enterprise analytics and monitoring platform.",
        image_url: "https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Project Nexus",
        description: "Decentralized task management system.",
        image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

export async function GET() {
    return NextResponse.json(projects);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.title || !body.description || !body.image_url) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newProject = {
            id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
            title: body.title,
            description: body.description,
            image_url: body.image_url
        };

        projects.push(newProject);

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request' },
            { status: 400 }
        );
    }
}
