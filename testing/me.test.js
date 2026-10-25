
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '15s',
};

export default function () {
  const res = http.get('http://localhost:5002/api/auth/me', {
    headers: {
      Authorization: `Bearer your token here`,
    },
  });

  const body = res.json();

  check(res, {
    'status is 200': (r) => r.status === 200,
    'request under 500ms': (r) => r.timings.duration < 500,
  });

  check(body, {
    'success is true': (b) => b.success === true,
    'user exists': (b) => !!b.data?.user?.id,
    'organization exists': (b) => !!b.data?.organization?.id,
    'roles exist': (b) => Array.isArray(b.data?.roles),
    'permissions exist': (b) => Array.isArray(b.data?.permissions),
    'subscription exists': (b) => !!b.data?.subscription?.id,
    'session exists': (b) => !!b.data?.session?.id,
  });
}