'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Menu } from '@/lib/types/menu';
import { MenuService } from '@/lib/services/menuService';
import { MenuWorkspace } from '@/components/builder/MenuWorkspace';
import { MenuPrototypeEntry } from '@/components/builder/prototype/MenuPrototypeEntry';

function BuilderContent() {
  const searchParams = useSearchParams();
  const menuId = searchParams.get('id');
  const [loaded, setLoaded] = useState<{ menu: Menu; initiallyPublished: boolean } | null>(null);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [workspaceError, setWorkspaceError] = useState('');
  useEffect(() => {
    let isMounted = true;

    async function loadOwnerWorkspace() {
      try {
        const response = await fetch('/api/auth/session', { cache: 'no-store' });
        const result = (await response.json()) as { owner?: { id: string } | null };
        if (!response.ok || !result.owner) {
          window.location.assign('/sign-in?next=%2Fbuilder');
          return;
        }

        const currentMenu = await MenuService.loadOwnerMenu(result.owner.id);

        if (isMounted) {
          setLoaded({
            menu: currentMenu || MenuService.createDefaultMenu(result.owner.id),
            initiallyPublished: Boolean(currentMenu),
          });
          setIsLoadingWorkspace(false);
        }
      } catch {
        if (isMounted) {
          setWorkspaceError('Unable to load your workspace. Please refresh and try again.');
          setIsLoadingWorkspace(false);
        }
      }
    }

    void loadOwnerWorkspace();
    return () => {
      isMounted = false;
    };
  }, [menuId]);

  if (isLoadingWorkspace || !loaded || workspaceError)
    return (
      <div className="flex min-h-screen items-center justify-center bg-menu-paper-200 p-6">
        <div className="text-center">
          {workspaceError ? (
            <>
              <p role="alert">{workspaceError}</p>
              <button type="button" onClick={() => window.location.reload()} className="mt-3 underline">
                Try again
              </button>
            </>
          ) : (
            <p role="status">Loading your workspace…</p>
          )}
        </div>
      </div>
    );
  if (process.env.NODE_ENV !== 'production' && searchParams.get('prototype') === 'composition') return <MenuPrototypeEntry />;
  return (
    <MenuWorkspace
      key={loaded.menu.id}
      initialMenu={loaded.menu}
      initiallyPublished={loaded.initiallyPublished}
    />
  );
}

export default function BuilderPage() {
  return (
    <Suspense
      fallback={
        <p role="status" className="p-6">
          Loading your workspace…
        </p>
      }
    >
      <BuilderContent />
    </Suspense>
  );
}
